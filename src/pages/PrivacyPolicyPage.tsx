import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Lock, FileText, Database } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="py-12 md:py-20 bg-neutral-bg">
      <Container size="md">
        <div className="space-y-4 mb-10 text-center">
          <Badge variant="primary">Data Protection &amp; Confidentiality</Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-text">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-muted">
            Last Updated: September 2026 • Compliant with international patient confidentiality standards
          </p>
        </div>

        <Card className="p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-neutral-muted leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>1. Overview &amp; Commitment to Patient Confidentiality</span>
            </h3>
            <p>
              AARUNYA operates an international healthcare discovery and medical tourism facilitation platform. We recognize that medical records, diagnostic scans, and clinical case histories are sensitive personal data. We are committed to safeguarding patient privacy using industry-standard cryptographic protocols, Row-Level Security (RLS) enforcement, and strict access controls.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <span>2. Information We Collect</span>
            </h3>
            <p>We collect and process the following categories of data solely to facilitate your clinical care:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Contact &amp; Identification Data:</strong> Full name, country of residence, contact phone number/WhatsApp, and email address.</li>
              <li><strong>Clinical Information:</strong> Medical histories, descriptions of symptoms, diagnostic images (MRI, CT, PET, X-rays), pathology reports, and physician consultation summaries provided voluntarily by you.</li>
              <li><strong>Travel &amp; Logistics Data:</strong> Preferred travel windows, passport copies (exclusively for medical visa invitation letters), and companion details when requested for hospital admission.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>3. How Medical Documents are Stored &amp; Protected</span>
            </h3>
            <p>
              All clinical documents uploaded for second opinions or treatment quotes are held in private, encrypted cloud storage buckets. We enforce Postgres Row Level Security (RLS) ensuring that only you, your assigned physician, and platform case coordinators can access your records. Files are accessed via temporary, short-lived signed URLs that automatically expire.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>4. Sharing of Information with Accredited Hospitals</span>
            </h3>
            <p>
              To procure treatment quotes, schedule consultations, or issue medical visa letters, your medical files are shared strictly with the accredited partner hospitals and verified clinical teams you authorize. We do not sell, rent, monetize, or publicly distribute your personal or medical data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text">
              5. Your Rights and Data Deletion
            </h3>
            <p>
              You have the right to request access to your uploaded records, request corrections, or instruct us to delete your medical files from our storage buckets at any point following the conclusion of your medical treatment.
            </p>
          </section>

          <div className="p-4 bg-neutral-bg border border-neutral-border rounded-card text-xs text-neutral-text">
            For privacy inquiries, data deletion requests, or compliance questions, please contact our Data Protection Officer at <strong className="text-primary">privacy@aarunya.com</strong>.
          </div>
        </Card>
      </Container>
    </div>
  );
};

