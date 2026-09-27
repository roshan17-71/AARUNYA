import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Treatment } from '../types';
import { treatmentsService } from '../services/treatments.service';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TreatmentFAQ } from '../features/treatments/TreatmentFAQ';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Clock,
  Building2,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  FileText,
  Headphones,
  CheckCircle2,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const TreatmentDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    treatmentsService
      .getTreatmentBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        setTreatment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`[TreatmentDetailPage] Error fetching treatment ${slug}:`, err);
        if (!isMounted) return;
        setTreatment(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="py-12 bg-neutral-bg min-h-[70vh]">
        <Container size="md" className="space-y-6">
          <Skeleton variant="text" className="w-48 h-4" />
          <Skeleton variant="rectangular" className="w-full h-36 rounded-card" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton variant="rectangular" className="md:col-span-2 h-64 rounded-card" />
            <Skeleton variant="rectangular" className="h-64 rounded-card" />
          </div>
        </Container>
      </div>
    );
  }

  // Graceful 404 / Unknown Slug State (§912)
  if (!treatment) {
    return (
      <div className="py-20 bg-neutral-bg min-h-[60vh]">
        <Container size="sm">
          <EmptyState
            icon={AlertTriangle}
            title="Treatment Not Found"
            description="We could not find the medical procedure you are looking for. It may have been renamed or is not yet published in our clinical directory."
            actionLabel="Browse All Treatments"
            onAction={() => window.location.assign('/treatments')}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-neutral-bg min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-subtle" />
          <Link to="/treatments" className="hover:text-primary transition-colors">
            Treatments
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-subtle" />
          <span className="text-neutral-text font-medium truncate max-w-xs sm:max-w-md">
            {treatment.name}
          </span>
        </nav>

        {/* Hero Header Banner */}
        <div className="p-6 sm:p-10 rounded-card bg-neutral-surface border border-neutral-border shadow-card mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="md">
                  {treatment.specialty}
                </Badge>
                <Badge variant="default" size="md">
                  {treatment.category}
                </Badge>
                <span className="text-xs text-status-success font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  JCI / NABH Protocol
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-neutral-text tracking-tight">
                {treatment.name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-neutral-muted pt-1">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Estimated Length of Stay:{' '}
                  <strong className="text-neutral-text">
                    {treatment.estimated_duration || 'Subject to clinical case review'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full justify-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Get Treatment Quote</span>
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full justify-center">
                  <Headphones className="w-4 h-4 mr-2 text-primary" />
                  <span>Talk to an Advisor</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Clinical Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Clinical Overview */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Procedure Overview</span>
              </h2>
              <div className="text-xs sm:text-sm text-neutral-muted leading-relaxed space-y-3">
                <p>{treatment.overview}</p>
                {treatment.description && <p>{treatment.description}</p>}
              </div>
            </Card>

            {/* 2. Symptoms & Clinical Indications */}
            {treatment.indications && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                  <span>When is this Treatment Indicated?</span>
                </h3>
                <div className="text-xs sm:text-sm text-neutral-muted leading-relaxed whitespace-pre-line">
                  {treatment.indications}
                </div>
              </Card>
            )}

            {/* 3. Surgical & Clinical Process */}
            {treatment.process && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>Step-by-Step Surgical &amp; Clinical Process</span>
                </h3>
                <div className="text-xs sm:text-sm text-neutral-muted leading-relaxed whitespace-pre-line">
                  {treatment.process}
                </div>
              </Card>
            )}

            {/* 4. Post-Operative Recovery & Rehab */}
            {treatment.recovery_info && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>Recovery &amp; Post-Operative Rehabilitation</span>
                </h3>
                <div className="text-xs sm:text-sm text-neutral-muted leading-relaxed whitespace-pre-line">
                  {treatment.recovery_info}
                </div>
              </Card>
            )}

            {/* 5. FAQs Accordion */}
            <TreatmentFAQ faqs={treatment.faqs} treatmentName={treatment.name} />
          </div>

          {/* Right Sticky Sidebar: Assistance & Action Cards */}
          <div className="space-y-6">
            {/* Free Quote Banner */}
            <Card className="p-6 bg-primary-light/50 border-primary/20 space-y-4">
              <div className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-text">
                  Request a Personalized Hospital Quote
                </h4>
                <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                  Upload recent medical scans for multi-hospital cost comparisons in India. Formal estimates prepared in 24–48 hours.
                </p>
              </div>
              <Link to="/contact">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Request Quote
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </Card>

            {/* Second Opinion Banner */}
            <Card className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-md bg-accent-light flex items-center justify-center text-accent-hover">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-text">
                  Second Medical Opinion
                </h4>
                <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                  Have an Indian department head review your surgical recommendation before traveling.
                </p>
              </div>
              <Link to="/second-opinion">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Explore 4 Opinion Tiers
                </Button>
              </Link>
            </Card>

            {/* Medical Disclaimer Note */}
            <div className="p-4 rounded-card bg-neutral-bg border border-neutral-border text-xs text-neutral-muted space-y-1.5">
              <p className="font-semibold text-neutral-text flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Clinical Estimation Notice</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Hospital stay durations and procedure costs are estimates based on standard clinical recovery. Final surgical quotes are determined after personalized pre-op examination.
              </p>
              <Link to="/medical-disclaimer" className="text-[11px] text-primary hover:underline block pt-1">
                Read Medical Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
