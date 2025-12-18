import { useNavigate } from 'react-router-dom';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
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
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold text-foreground">Privacy Policy</h1>
        </div>
        
        <p className="text-sm text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

        <HUDCard className="p-6 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
            <p className="text-muted-foreground">
              Ascendency ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services (collectively, the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            
            <h3 className="font-medium text-foreground mt-4 mb-2">2.1 Personal Information</h3>
            <p className="text-muted-foreground mb-2">We may collect the following personal information:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Email address and account credentials</li>
              <li>Username and profile information</li>
              <li>Age, height, weight, and ethnicity (provided during onboarding)</li>
              <li>Health and lifestyle habits</li>
            </ul>

            <h3 className="font-medium text-foreground mt-4 mb-2">2.2 Biometric Data</h3>
            <p className="text-muted-foreground mb-2">
              <strong className="text-foreground">Important:</strong> Our Service collects and processes facial photographs for aesthetic analysis purposes. This includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Facial photographs (front view, smile, side profile)</li>
              <li>Facial geometry analysis data</li>
              <li>Progress tracking photographs</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              We will always obtain your explicit consent before collecting biometric data. You may withdraw consent at any time by deleting your account.
            </p>

            <h3 className="font-medium text-foreground mt-4 mb-2">2.3 Usage Data</h3>
            <p className="text-muted-foreground">
              We automatically collect certain information about your device and usage, including device type, operating system, app interactions, and crash reports.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-2">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Provide personalized aesthetic recommendations</li>
              <li>Generate facial analysis reports</li>
              <li>Track your progress over time</li>
              <li>Improve our AI analysis algorithms</li>
              <li>Communicate with you about your account</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Storage and Security</h2>
            <p className="text-muted-foreground">
              Your data is stored securely using industry-standard encryption. Facial photographs are stored in encrypted cloud storage with strict access controls. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Sharing</h2>
            <p className="text-muted-foreground mb-2">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Service providers who assist in operating our Service</li>
              <li>AI processing services for facial analysis (anonymized where possible)</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data and account</li>
              <li>Export your data</li>
              <li>Withdraw consent for biometric processing</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Biometric Data Rights (BIPA Compliance)</h2>
            <p className="text-muted-foreground">
              For residents of Illinois and other jurisdictions with biometric privacy laws: We obtain informed written consent before collecting biometric data. We do not sell, lease, or trade biometric data. Biometric data is stored only as long as necessary and is destroyed when the initial purpose is fulfilled or within 3 years of your last interaction with the Service, whichever comes first.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for individuals under 16 years of age. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide services. Facial photographs and analysis data are retained until you delete them or your account. You can request deletion at any time through the app settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at:
            </p>
            <p className="text-primary mt-2">support@ascendency.app</p>
          </section>
        </HUDCard>
      </div>
    </div>
  );
}
