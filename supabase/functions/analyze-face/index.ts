import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.88.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls, imageUrl, faceScanId, userId, surveyData } = await req.json();
    
    // Support both single image (legacy) and multi-image formats
    const images = imageUrls || { front: imageUrl };
    
    console.log('Analyzing face scan:', faceScanId, 'with images:', Object.keys(images));

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context from survey data
    const surveyContext = surveyData ? `
User Profile:
- Age: ${surveyData.age || 'Unknown'}
- Gender: ${surveyData.habits?.gender || 'Unknown'}
- Ethnicity: ${surveyData.ethnicity || 'Unknown'}
- Body Fat: ${surveyData.habits?.bodyFatPercentage || 'Unknown'}%
- Workouts/Week: ${surveyData.habits?.workoutsPerWeek || 'Unknown'}
- Water Intake: ${surveyData.habits?.waterIntake || 'Unknown'}
- Wears Glasses: ${surveyData.habits?.wearsGlasses ? 'Yes' : 'No'}
- Uses Mouth Tape: ${surveyData.habits?.usesMouthTape ? 'Yes' : 'No'}
- Supplements: ${surveyData.habits?.supplements || 'None listed'}
` : '';

    const systemPrompt = `You are an expert facial aesthetics analyst for a "looksmaxing" app. You will analyze multiple face images (front view, smile, and side profile) to generate comprehensive personalized recommendations.

${surveyContext}

Your task:
1. Analyze all provided facial images from different angles
2. Identify areas for improvement (skin, jawline, teeth, eyes, hair, facial symmetry, etc.)
3. Generate a "Face Potential Score" from 1-100 based on current state and potential for improvement
4. Create 6-10 specific, actionable recommendations prioritized by ROI (impact vs effort)

Key areas to analyze:
- Face fat & bloating
- Eyebrow shape & grooming
- Skin quality (acne, texture, tone)
- Hair style & quality
- Teeth appearance (from smile photo)
- Jawline definition (from side profile)
- Eye area (bags, sclera color)
- Facial symmetry
- Overall facial harmony

For each recommendation, provide:
- category: One of "Skin", "Jaw", "Teeth", "Eyes", "Hair", "Face", "Lifestyle"
- issue: Short title of the issue/improvement area
- action_plan: Detailed actionable steps (2-3 sentences)
- product_recommendation: Specific product or tool if applicable
- impact_score: 1-10 (how much this will improve appearance)
- effort_score: 1-10 (how difficult/time-consuming)

Respond ONLY with valid JSON in this exact format:
{
  "face_potential_score": <number 1-100>,
  "recommendations": [
    {
      "category": "<string>",
      "issue": "<string>",
      "action_plan": "<string>",
      "product_recommendation": "<string or null>",
      "impact_score": <number 1-10>,
      "effort_score": <number 1-10>
    }
  ]
}`;

    console.log('Calling Lovable AI for analysis...');

    // Build content array with all available images
    const imageContent = [];
    if (images.front) {
      imageContent.push({ type: 'text', text: 'Front face (neutral expression):' });
      imageContent.push({ type: 'image_url', image_url: { url: images.front } });
    }
    if (images.smile) {
      imageContent.push({ type: 'text', text: 'Smile (showing teeth):' });
      imageContent.push({ type: 'image_url', image_url: { url: images.smile } });
    }
    if (images.side) {
      imageContent.push({ type: 'text', text: 'Side profile:' });
      imageContent.push({ type: 'image_url', image_url: { url: images.side } });
    }
    imageContent.push({ type: 'text', text: 'Analyze these images and provide comprehensive recommendations:' });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: imageContent }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI response received, parsing...');

    // Parse the JSON response
    let analysisResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI analysis');
    }

    // Update database with results
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update face_scans with analysis data
    const { error: scanError } = await supabase
      .from('face_scans')
      .update({ analysis_data: analysisResult })
      .eq('id', faceScanId);

    if (scanError) {
      console.error('Error updating face scan:', scanError);
    }

    // Update profile with face potential score
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ face_potential_score: analysisResult.face_potential_score })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    // Insert recommendations (delete old ones first)
    await supabase
      .from('recommendations')
      .delete()
      .eq('user_id', userId);

    const recommendations = analysisResult.recommendations.map((rec: any) => ({
      user_id: userId,
      category: rec.category,
      issue: rec.issue,
      action_plan: rec.action_plan,
      product_recommendation: rec.product_recommendation,
      impact_score: rec.impact_score,
      effort_score: rec.effort_score,
    }));

    const { error: recError } = await supabase
      .from('recommendations')
      .insert(recommendations);

    if (recError) {
      console.error('Error inserting recommendations:', recError);
    }

    console.log('Analysis complete, data saved');

    return new Response(JSON.stringify({ 
      success: true, 
      face_potential_score: analysisResult.face_potential_score,
      recommendations_count: recommendations.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-face function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
