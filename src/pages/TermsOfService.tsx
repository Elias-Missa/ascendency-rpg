import { useNavigate } from 'react-router-dom';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();
  const lastUpdated = 'December 18, 2025';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold text-foreground">Terms of Service</h1>
        </div>
        
        <p className="text-sm text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

        <HUDCard className="p-6 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Ascendency ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App. We reserve the right to modify these Terms at any time, and your continued use of the App constitutes acceptance of any modifications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Ascendency is a personal aesthetic improvement application that uses artificial intelligence to analyze facial features and provide personalized recommendations. The Service includes facial analysis, progress tracking, personalized recommendations, and educational content related to personal appearance improvement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3 text-destructive">3. Medical Disclaimer</h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-foreground font-medium mb-2">IMPORTANT: NOT MEDICAL ADVICE</p>
              <p className="text-muted-foreground">
                The App provides <strong>cosmetic suggestions only</strong> and is NOT a substitute for professional medical advice, diagnosis, or treatment. The recommendations provided are for informational and entertainment purposes only. Always consult with qualified healthcare professionals before making any decisions that may affect your health. We are not responsible for any health outcomes resulting from following suggestions in the App.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. User Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 16 years old to use this App. By using the App, you represent and warrant that you meet this age requirement. Users under 18 should use the App under parental supervision.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Account Registration</h2>
            <p className="text-muted-foreground">
              To use certain features of the App, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to update your information as necessary.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Biometric Data Consent</h2>
            <p className="text-muted-foreground">
              By using the facial analysis features of the App, you explicitly consent to the collection, processing, and storage of your facial photographs and derived biometric data as described in our Privacy Policy. You may withdraw this consent at any time by deleting your account, which will result in the deletion of your biometric data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Acceptable Use</h2>
            <p className="text-muted-foreground mb-2">You agree NOT to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Upload photos of other people without their consent</li>
              <li>Use the App for any illegal or unauthorized purpose</li>
              <li>Attempt to reverse engineer or hack the App</li>
              <li>Upload inappropriate, offensive, or illegal content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Share your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, features, and functionality of the App, including but not limited to text, graphics, logos, icons, images, audio, video, software, and the compilation thereof, are the exclusive property of Ascendency and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. User Content</h2>
            <p className="text-muted-foreground">
              You retain ownership of photos and content you upload. By uploading content, you grant us a limited license to use, process, and store such content for the purpose of providing and improving the Service. We do not share your photos publicly without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Premium Features and Payments</h2>
            <p className="text-muted-foreground">
              Certain features may require payment ("Premium Features"). All payments are processed through third-party payment providers. Subscription fees are billed in advance on a recurring basis. You may cancel your subscription at any time, but refunds are subject to our refund policy and the policies of the app store through which you subscribed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASCENDENCY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APP. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. AI-GENERATED RECOMMENDATIONS MAY NOT BE ACCURATE OR SUITABLE FOR YOUR INDIVIDUAL CIRCUMSTANCES.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless Ascendency and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the App or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">14. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to the App at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. Upon termination, your right to use the App will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">15. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of Delaware.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">16. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">17. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-primary mt-2">legal@ascendency.app</p>
          </section>
        </HUDCard>
      </div>
    </div>
  );
}
