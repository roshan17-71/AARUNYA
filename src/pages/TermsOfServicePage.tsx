import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Scale, FileCheck, AlertCircle } from 'lucide-react';

export const TermsOfServicePage = () => {
  return (
    <div className="py-12 md:py-20 bg-neutral-bg">
      <Container size="md">
        <div className="space-y-4 mb-10 text-center">
          <Badge variant="primary">Legal Terms</Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-text">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-muted">
            Last Updated: September 2026 • Governing your use of the AARUNYA healthcare platform
          </p>
        </div>

        <Card className="p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-neutral-muted leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <span>1. Nature of the Platform &amp; Facilitation Scope</span>
            </h3>
            <p>
              AARUNYA is an independent medical discovery and healthcare facilitation technology platform. AARUNYA does not own, manage, or operate hospitals, outpatient surgical centers, diagnostic laboratories, or clinical consultation practices. Our services are limited to facilitating information discovery, second medical opinions, consultation appointment scheduling, and non-clinical travel support.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              <span>2. Provider Relationships &amp; Direct Clinical Care</span>
            </h3>
            <p>
              All clinical diagnoses, prescriptions, surgical recommendations, and treatments are rendered exclusively by licensed, independent hospitals and certified medical practitioners. The contract for medical care, surgical consent, and hospital admission is entered into directly between you (the patient or legal guardian) and the chosen healthcare provider.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span>3. User Responsibilities &amp; Medical Disclosures</span>
            </h3>
            <p>
              Patients agree to provide complete, truthful, and accurate medical history and diagnostic files. Withholding prior conditions, allergies, or diagnostic records may impair physician assessments and void hospital treatment estimates.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text">
              4. Treatment Estimates &amp; Financial Arrangements
            </h3>
            <p>
              All pricing figures displayed on the website or in preliminary cost estimates are indicative estimates based on typical lengths of hospital stay. Actual medical fees are determined by the treating hospital following in-person pre-operative evaluations and are billed directly by the hospital facility.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text">
              5. Travel &amp; External Redirect Disclaimers
            </h3>
            <p>
              External flight searches and hotel recommendations are third-party redirect links provided for convenience. AARUNYA does not operate travel booking engines or issue airline tickets and bears no liability for flight cancellations, carrier rescheduling, or immigration visa grant decisions rendered by government authorities.
            </p>
          </section>

          <div className="p-4 bg-neutral-bg border border-neutral-border rounded-card text-xs text-neutral-text">
            For legal inquiries or notices regarding these terms, please write to <strong className="text-primary">legal@aarunya.com</strong>.
          </div>
        </Card>
      </Container>
    </div>
  );
};

