import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, ShieldAlert, HeartHandshake, Stethoscope } from 'lucide-react';

export const MedicalDisclaimerPage = () => {
  return (
    <div className="py-12 md:py-20 bg-neutral-bg">
      <Container size="md">
        <div className="space-y-4 mb-10 text-center">
          <Badge variant="warning">Important Patient Notice</Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-text">
            Medical Disclaimer
          </h1>
          <p className="text-xs text-neutral-muted">
            Please read this clinical notice carefully prior to using our services.
          </p>
        </div>

        <Card className="p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-neutral-muted leading-relaxed">
          {/* Prominent Warning Callout */}
          <div className="p-4 bg-status-warning-bg/70 border border-status-warning/40 rounded-card flex items-start gap-3 text-status-warning">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-status-warning" />
            <div className="text-xs text-neutral-text space-y-1">
              <p className="font-bold text-neutral-text">
                Not a Substitute for Emergency Medical Care or In-Person Medical Examination
              </p>
              <p>
                If you are experiencing a life-threatening medical emergency, acute chest pain, severe shortness of breath, or trauma, do NOT use this website. Immediately contact your local emergency services or visit the nearest emergency medical department.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span>1. Informational &amp; Facilitation Role Only</span>
            </h3>
            <p>
              AARUNYA is not a hospital, clinic, diagnostic imaging center, or medical provider. The content displayed across this website — including procedure overviews, recovery timelines, hospital descriptions, and doctor qualifications — is presented exclusively for general health informational and comparison purposes.
            </p>
            <p>
              Nothing contained on this website or communicated by AARUNYA patient care coordinators should be construed as formal medical diagnosis, individualized clinical prescription, or surgical treatment recommendations.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <span>2. No Guaranteed Clinical Outcomes</span>
            </h3>
            <p>
              Every human body, anatomical condition, and clinical progression is unique. Medical and surgical outcomes cannot be guaranteed under any circumstances. Historical treatment success rates, patient stories, and case studies featured on the platform reflect individual patient experiences and do not constitute a guarantee of identical or similar results.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-primary" />
              <span>3. Treatment Costs &amp; Hospital Stay Estimates</span>
            </h3>
            <p>
              All fee ranges, package costs, and duration of hospital stay estimates are subject to personalized clinical evaluation. Final surgical quotes and hospital bills depend on the treating physician’s evaluation of pre-operative imaging, intra-operative findings, choice of implant/prosthetic, and post-operative recovery progress.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-neutral-text">
              4. Direct Doctor-Patient Relationship
            </h3>
            <p>
              Any formal doctor-patient relationship is established exclusively between you and the medical practitioner conducting your video consultation or in-person evaluation, not with AARUNYA. You should always consult with your primary attending physician in your home country before undergoing major surgery abroad.
            </p>
          </section>
        </Card>
      </Container>
    </div>
  );
};

