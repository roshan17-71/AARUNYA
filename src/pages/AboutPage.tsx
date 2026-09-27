import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Globe2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="py-12 md:py-20 bg-neutral-bg space-y-16">
      <Container>
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="primary" size="md">Our Mission</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-text">
            Bridging Borders to Deliver World-Class Healthcare
          </h1>
          <p className="text-sm sm:text-base text-neutral-muted leading-relaxed">
            AARUNYA was established to eliminate uncertainty, language barriers, and inflated costs for international patients seeking advanced surgical care in India.
          </p>
        </div>

        {/* Narrative & Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-neutral-text">
              Built on Trust, Clinical Integrity, and Patient Empathy
            </h3>
            <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed">
              Seeking specialized medical care away from home is one of the most significant decisions a family can make. AARUNYA operates as an independent discovery and facilitation platform, vetting hospitals and clinicians on verifiable quality parameters rather than advertising spend.
            </p>
            <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed">
              We work exclusively with hospitals holding National Accreditation Board for Hospitals &amp; Healthcare Providers (NABH) and Joint Commission International (JCI) certifications, ensuring patients receive the highest tier of infection control, clinical governance, and surgical safety.
            </p>
          </div>

          <div className="p-8 rounded-card bg-neutral-surface border border-neutral-border shadow-card space-y-4">
            <h4 className="text-sm font-bold text-neutral-text uppercase tracking-wider">
              Our Core Tenets
            </h4>
            <div className="space-y-3 text-xs text-neutral-muted">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <span><strong>No Unverified Claims:</strong> All estimates and timelines are based on clinical averages and personalized doctor evaluations.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <span><strong>Strict Document Privacy:</strong> Patient records are protected with bank-grade encryption and Row-Level Security.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                <span><strong>Direct Hospital Billing:</strong> Patients pay hospitals directly with zero intermediary markups or hidden booking fees.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8">
          <Card className="p-6">
            <div className="w-10 h-10 rounded-md bg-primary-light flex items-center justify-center text-primary mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-neutral-text mb-1">Accredited Network</h4>
            <p className="text-xs text-neutral-muted leading-relaxed">
              Over 500 NABH and JCI certified hospital centers in New Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-md bg-accent-light flex items-center justify-center text-accent-hover mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-neutral-text mb-1">Veteran Surgeons</h4>
            <p className="text-xs text-neutral-muted leading-relaxed">
              Access to department heads with extensive fellowship training in the United Kingdom, United States, and Europe.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-md bg-status-info-bg flex items-center justify-center text-status-info mb-3">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-neutral-text mb-1">Global Desks</h4>
            <p className="text-xs text-neutral-muted leading-relaxed">
              Dedicated liaison desks supporting patients across the Middle East, Central Asia, Africa, and North America.
            </p>
          </Card>
        </div>

        {/* Call to action */}
        <div className="pt-8 text-center">
          <Link to="/treatments">
            <Button variant="primary" size="lg">
              <span>Explore Our Medical Directory</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

