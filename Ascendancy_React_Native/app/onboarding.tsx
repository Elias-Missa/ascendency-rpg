import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, FlatList, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { CyberBackground } from '@/components/CyberBackground';
import { HUDCard } from '@/components/HUDCard';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Check, ChevronDown, Plus, Shield, Dumbbell, Droplets, Glasses, Moon } from 'lucide-react-native';

// --- Custom Components for this screen ---

const StepIndicator = ({ current }: { current: number }) => (
    <View className="flex-row justify-center items-center gap-4 mb-8 pt-4">
        {[1, 2, 3].map((step) => (
            <View key={step} className="items-center">
                <View
                    className={`w-10 h-10 rounded-full items-center justify-center border-2 
          ${step === current ? 'border-primary bg-primary/20 shadow-primary shadow-sm' : 'border-muted bg-card'}
          ${step < current ? 'border-primary bg-primary' : ''}`}
                >
                    <Text className={`font-mono font-bold ${step <= current ? 'text-white' : 'text-muted-foreground'}`}>
                        {step}
                    </Text>
                </View>
                {step < 3 && <View className="absolute left-10 top-5 w-4 h-[2px] bg-muted/30" />}
            </View>
        ))}
    </View>
);

const UnitToggle = ({ value, option1, option2, onChange }: any) => (
    <View className="flex-row border border-primary/50 rounded-md overflow-hidden">
        <TouchableOpacity
            onPress={() => onChange(option1)}
            className={`px-3 py-1 ${value === option1 ? 'bg-primary' : 'bg-transparent'}`}
        >
            <Text className={`text-xs font-bold font-mono ${value === option1 ? 'text-black' : 'text-primary'}`}>
                {option1}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => onChange(option2)}
            className={`px-3 py-1 ${value === option2 ? 'bg-primary' : 'bg-transparent'}`}
        >
            <Text className={`text-xs font-bold font-mono ${value === option2 ? 'text-black' : 'text-primary'}`}>
                {option2}
            </Text>
        </TouchableOpacity>
    </View>
);

const CustomSwitch = ({ value, onValueChange }: any) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onValueChange(!value)}
        className={`w-12 h-6 rounded-full border border-border p-[2px] ${value ? 'bg-primary/20 border-primary' : 'bg-input'}`}
    >
        <View className={`w-5 h-5 rounded-full ${value ? 'bg-primary translate-x-6' : 'bg-muted-foreground translate-x-0'}`} />
    </TouchableOpacity>
);

// --- Main Screen ---

export default function OnboardingScreen() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Vital Stats
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('CM');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('KG');
    const [ethnicity, setEthnicity] = useState('');

    // Step 2: Lifestyle
    const [workouts, setWorkouts] = useState(3);
    const [water, setWater] = useState('');
    const [vision, setVision] = useState(false);
    const [mouthTape, setMouthTape] = useState(false);

    // Step 3: Inventory
    const [supplementInput, setSupplementInput] = useState('');
    const [supplements, setSupplements] = useState<string[]>([]);
    const [consent, setConsent] = useState(false);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const addSupplement = () => {
        if (supplementInput.trim()) {
            setSupplements([...supplements, supplementInput.trim()]);
            setSupplementInput('');
        }
    };

    const handleSubmit = async () => {
        if (!consent) {
            Alert.alert('Consent Required', 'You must agree to the privacy policy to proceed.');
            return;
        }
        setLoading(true);
        try {
            // Convert height/weight to standard units if needed
            const heightCm = heightUnit === 'FT' ? parseFloat(height) * 30.48 : parseFloat(height);
            const weightKg = weightUnit === 'LBS' ? parseFloat(weight) * 0.453592 : parseFloat(weight);

            const { error } = await supabase.from('onboarding_surveys').insert({
                user_id: user?.id,
                age: parseInt(age) || 0,
                weight_kg: weightKg || 0,
                height_cm: heightCm || 0,
                habits: {
                    gender,
                    ethnicity,
                    workoutsPerWeek: workouts,
                    waterIntake: water,
                    visionCorrection: vision,
                    mouthTaping: mouthTape,
                    supplements
                },
                consented_to_biometrics: consent,
            });

            if (error) throw error;
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background relative">
            <CyberBackground />
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>

                    <StepIndicator current={step} />

                    {/* --- STEP 1: VITAL STATS --- */}
                    {step === 1 && (
                        <View className="gap-6">
                            <View>
                                <Text className="text-white font-display text-2xl uppercase tracking-wider">Vital Stats</Text>
                                <Text className="text-muted-foreground font-mono">The Basics</Text>
                                <View className="h-[1px] bg-primary/30 w-full mt-4" />
                            </View>

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-muted-foreground font-mono text-xs uppercase mb-2 ml-1">Age</Text>
                                    <TextInput
                                        value={age}
                                        onChangeText={setAge}
                                        keyboardType="numeric"
                                        className="bg-card border border-border rounded-md p-4 text-white font-body text-lg"
                                        placeholder="25"
                                        placeholderTextColor="#555"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-muted-foreground font-mono text-xs uppercase mb-2 ml-1">Gender</Text>
                                    {/* Mock Select */}
                                    <TouchableOpacity className="bg-card border border-border rounded-md p-4 flex-row justify-between items-center">
                                        <Text className="text-white font-body">{gender || 'Select...'}</Text>
                                        <ChevronDown size={16} color={Colors.mutedForeground} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View>
                                <View className="flex-row justify-between mb-2 ml-1">
                                    <Text className="text-muted-foreground font-mono text-xs uppercase">Height</Text>
                                    <UnitToggle value={heightUnit} option1="CM" option2="FT" onChange={setHeightUnit} />
                                </View>
                                <TextInput
                                    value={height}
                                    onChangeText={setHeight}
                                    keyboardType="numeric"
                                    className="bg-card border border-border rounded-md p-4 text-white font-body text-lg"
                                    placeholder="170"
                                    placeholderTextColor="#555"
                                />
                            </View>

                            <View>
                                <View className="flex-row justify-between mb-2 ml-1">
                                    <Text className="text-muted-foreground font-mono text-xs uppercase">Weight</Text>
                                    <UnitToggle value={weightUnit} option1="KG" option2="LBS" onChange={setWeightUnit} />
                                </View>
                                <TextInput
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType="numeric"
                                    className="bg-card border border-border rounded-md p-4 text-white font-body text-lg"
                                    placeholder="70"
                                    placeholderTextColor="#555"
                                />
                            </View>

                            <View>
                                <Text className="text-muted-foreground font-mono text-xs uppercase mb-2 ml-1">Ethnicity</Text>
                                <TouchableOpacity className="bg-card border border-border rounded-md p-4 flex-row justify-between items-center">
                                    <Text className="text-white font-body">{ethnicity || 'Select ethnicity...'}</Text>
                                    <ChevronDown size={16} color={Colors.mutedForeground} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* --- STEP 2: LIFESTYLE --- */}
                    {step === 2 && (
                        <View className="gap-6">
                            <View>
                                <Text className="text-white font-display text-2xl uppercase tracking-wider">Lifestyle</Text>
                                <Text className="text-muted-foreground font-mono">Hunter Habits</Text>
                                <View className="h-[1px] bg-primary/30 w-full mt-4" />
                            </View>

                            <View className="bg-card border border-border rounded-lg p-4">
                                <View className="flex-row items-center gap-3 mb-4">
                                    <View className="w-10 h-10 rounded-md bg-primary/10 items-center justify-center border border-primary/30">
                                        <Dumbbell size={20} color={Colors.primary} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-display uppercase text-sm">Workouts Per Week</Text>
                                        <Text className="text-primary font-mono text-xl">{workouts}</Text>
                                    </View>
                                    <Text className="text-muted-foreground ml-auto font-display text-2xl">{workouts}</Text>
                                </View>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={7}
                                    step={1}
                                    value={workouts}
                                    onValueChange={setWorkouts}
                                    minimumTrackTintColor={Colors.primary}
                                    maximumTrackTintColor={Colors.border}
                                    thumbTintColor={Colors.primary}
                                />
                                <View className="flex-row justify-between px-2">
                                    <Text className="text-muted-foreground text-xs">0 days</Text>
                                    <Text className="text-muted-foreground text-xs">7 days</Text>
                                </View>
                            </View>

                            <View className="bg-card border border-border rounded-lg p-4">
                                <View className="flex-row items-center gap-3 mb-4">
                                    <View className="w-10 h-10 rounded-md bg-primary/10 items-center justify-center border border-primary/30">
                                        <Droplets size={20} color={Colors.primary} />
                                    </View>
                                    <Text className="text-white font-display uppercase text-sm flex-1">Daily Water Intake</Text>
                                </View>
                                <TextInput
                                    value={water}
                                    onChangeText={setWater}
                                    className="bg-background border border-border rounded-md p-3 text-white font-body"
                                    placeholder="e.g. 2 Liters"
                                    placeholderTextColor="#555"
                                />
                            </View>

                            <View className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 rounded-md bg-primary/10 items-center justify-center border border-primary/30">
                                        <Glasses size={20} color={Colors.primary} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-display uppercase text-sm">Vision Correction</Text>
                                        <Text className="text-muted-foreground text-xs w-48">Do you wear glasses or contacts?</Text>
                                    </View>
                                </View>
                                <CustomSwitch value={vision} onValueChange={setVision} />
                            </View>

                            <View className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 rounded-md bg-primary/10 items-center justify-center border border-primary/30">
                                        <Moon size={20} color={Colors.primary} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-display uppercase text-sm">Night Mouth Taping</Text>
                                        <Text className="text-muted-foreground text-xs w-48">Do you use mouth tape while sleeping?</Text>
                                    </View>
                                </View>
                                <CustomSwitch value={mouthTape} onValueChange={setMouthTape} />
                            </View>
                        </View>
                    )}

                    {/* --- STEP 3: INVENTORY --- */}
                    {step === 3 && (
                        <View className="gap-6">
                            <View>
                                <Text className="text-white font-display text-2xl uppercase tracking-wider">Inventory</Text>
                                <Text className="text-muted-foreground font-mono">Calibration</Text>
                                <View className="h-[1px] bg-primary/30 w-full mt-4" />
                            </View>

                            <View className="bg-card border border-border rounded-lg p-4">
                                <View className="flex-row items-center gap-3 mb-4">
                                    <View className="w-10 h-10 rounded-md bg-primary/10 items-center justify-center border border-primary/30">
                                        <Plus size={20} color={Colors.primary} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-display uppercase text-sm">Supplements & Meds</Text>
                                        <Text className="text-muted-foreground text-xs">Current items you're taking</Text>
                                    </View>
                                </View>
                                <View className="flex-row gap-2">
                                    <TextInput
                                        value={supplementInput}
                                        onChangeText={setSupplementInput}
                                        className="flex-1 bg-background border border-border rounded-md p-3 text-white font-body"
                                        placeholder="e.g., Creatine, Minoxidil..."
                                        placeholderTextColor="#555"
                                    />
                                    <TouchableOpacity
                                        onPress={addSupplement}
                                        className="w-12 items-center justify-center bg-card border border-primary/50 rounded-md"
                                    >
                                        <Plus size={24} color={Colors.primary} />
                                    </TouchableOpacity>
                                </View>

                                <View className="mt-4 bg-background/50 rounded-md p-4 min-h-[60px] border border-dashed border-border">
                                    {supplements.length === 0 ? (
                                        <Text className="text-muted-foreground font-mono text-xs text-center mt-2">No items added yet</Text>
                                    ) : (
                                        <View className="flex-row flex-wrap gap-2">
                                            {supplements.map((item, i) => (
                                                <View key={i} className="bg-primary/20 border border-primary/50 rounded-full px-3 py-1 flex-row items-center gap-2">
                                                    <Text className="text-primary text-xs">{item}</Text>
                                                    <TouchableOpacity onPress={() => setSupplements(supplements.filter((_, idx) => idx !== i))}>
                                                        <Text className="text-primary font-bold">×</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View className="bg-card border-2 border-primary/30 rounded-lg p-6 relative">
                                <View className="flex-row items-center gap-3 mb-4">
                                    <View className="w-10 h-10 rounded-md bg-primary items-center justify-center">
                                        <Shield size={20} color="black" fill="black" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-display uppercase text-sm">Legal Consent Required</Text>
                                        <Text className="text-muted-foreground text-xs">BIPA & Privacy Compliance</Text>
                                    </View>
                                </View>

                                <Text className="text-muted-foreground text-xs leading-5 mb-6">
                                    By checking the box below, you consent to the collection and AI-powered analysis of your facial biometric data for the purpose of providing personalized recommendations.
                                    {'\n\n'}
                                    Your data is encrypted and stored securely. You may request deletion at any time.
                                </Text>

                                <TouchableOpacity
                                    onPress={() => setConsent(!consent)}
                                    className="flex-row items-start gap-4"
                                >
                                    <View className={`w-6 h-6 rounded border ${consent ? 'bg-primary border-primary' : 'border-muted-foreground'} items-center justify-center`}>
                                        {consent && <Check size={16} color="black" strokeWidth={3} />}
                                    </View>
                                    <Text className="text-white font-bold text-sm flex-1">
                                        I consent to AI-powered biometric analysis and understand how my data will be used.
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View className="flex-row gap-4 mt-8 pb-8">
                        {step > 1 && (
                            <Button label="BACK" variant="outline" onPress={handleBack} className="flex-1" />
                        )}
                        <Button
                            label={step === 3 ? "COMPLETE PROFILE" : "NEXT STEP"}
                            variant="primary"
                            onPress={handleNext}
                            loading={loading}
                            className="flex-1"
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
