import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Badge } from '../components/ui/Badge';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import { ServiceTierCard } from '../features/second-opinion/ServiceTierCard';
import {
  secondOpinionService,
  FALLBACK_SECOND_OPINION_SERVICES
} from '../services/secondOpinion.service';
import { SecondOpinionService } from '../types';

export const SecondOpinionPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<SecondOpinionService[]>(FALLBACK_SECOND_OPINION_SERVICES);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const data = await secondOpinionService.getServices();
        setServices(data);
      } catch {
        setServices(FALLBACK_SECOND_OPINION_SERVICES);
      }
    };
    fetchTiers();
  }, []);

  const handleSelectTier = (service: SecondOpinionService) => {
    navigate(`/second-opinion/request?tier=${service.slug}`);
  };

  const secondOpinionFaqs = [
    {
      question: 'Why should I seek a second opinion from Indian super-specialists?',
      answer:
        'India is home to globally recognized centers of medical excellence with clinicians trained at institutions in the US, UK, and Europe. Seeking an independent second opinion validates your primary diagnosis, uncovers modern minimally invasive treatment alternatives, and helps you avoid unnecessary or premature surgical interventions.'
    },
    {
      question: 'What documents and records do I need to provide?',
      answer:
        'To ensure an accurate clinical review, we recommend uploading your recent doctor consultation summaries, discharge summaries, laboratory reports, histopathology (biopsy) slides/reports, and high-resolution diagnostic imaging (MRI, CT, PET scans, or DICOM files).'
    },
    {
      question: 'How quickly will I receive my written second opinion report?',
      answer:
        'Depending on the tier selected, clinical turnaround ranges from 48–72 hours for a standard Clinical Review to 3–5 business days for comprehensive multidisciplinary tumor and case board evaluations.'
    },
    {
      question: 'Will I be able to speak directly with the reviewing specialist?',
      answer:
        'Yes. If you choose the "Comprehensive Review + Video Consultation" tier, a dedicated 30-minute direct teleconsultation with the senior super-specialist is scheduled following initial record evaluation.'
    },
    {
      question: 'Does this second opinion replace my existing physician?',
      answer:
        'No. A second medical opinion is an advisory evaluation created to give you and your local attending doctor clarity and actionable insights. It does not replace emergency medical care or direct physical examinations.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-surface py-12">
      <Container className="space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary" className="px-3 py-1 text-xs font-semibold">
            Specialist Clinical Review
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-neutral-text tracking-tight">
            Independent Second Medical Opinions from India's Top Specialists
          </h1>
          <p className="text-sm md:text-base text-neutral-muted leading-relaxed">
            Gain diagnostic clarity, explore advanced treatment alternatives, and make informed healthcare decisions backed by accredited international medical boards.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-neutral-text font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>NABH & JCI Hospital Specialists</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>48–72h Expedited Turnaround</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" />
              <span>Multidisciplinary Review Panels</span>
            </div>
          </div>
        </div>

        {/* 4 Service Tiers Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold font-serif text-neutral-text">
              Choose an Opinion Service Tier
            </h2>
            <p className="text-xs text-neutral-muted mt-1">
              Select the level of diagnostic assessment suited to your medical condition and imaging needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceTierCard
                key={service.id}
                service={service}
                isPopular={
                  service.slug === 'medical-record-review' ||
                  service.slug === 'review-video-consultation'
                }
                onSelect={handleSelectTier}
                ctaText="Request Review"
              />
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-neutral-background/70 border border-neutral-border rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Step-by-Step Workflow
            </span>
            <h2 className="text-2xl font-bold font-serif text-neutral-text mt-1">
              How the Second Opinion Process Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white rounded-xl border border-neutral-border shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto font-bold text-base">
                1
              </div>
              <h3 className="font-bold text-sm text-neutral-text">
                Submit Medical History
              </h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Select your service tier, detail symptoms, previous diagnoses, and specific clinical questions.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-neutral-border shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto font-bold text-base">
                2
              </div>
              <h3 className="font-bold text-sm text-neutral-text">
                Secure Document Upload
              </h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Upload discharge summaries, lab reports, biopsy histopathology, and radiology scans into our encrypted vault.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-neutral-border shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto font-bold text-base">
                3
              </div>
              <h3 className="font-bold text-sm text-neutral-text">
                Specialist Evaluation
              </h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                An accredited Indian super-specialist or multidisciplinary board conducts an exhaustive secondary analysis.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-neutral-border shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto font-bold text-base">
                4
              </div>
              <h3 className="font-bold text-sm text-neutral-text">
                Advisory Report & Next Steps
              </h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Receive your comprehensive PDF clinical report, treatment roadmap, and optional 1-on-1 video call.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory & Clinical Advisory Notice */}
        <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950">
              Regulatory & Clinical Advisory Notice (§15 Wording Compliance)
            </h4>
            <p>
              Second medical opinion consultations and reports are strictly advisory clinical assessments intended to provide supplemental medical insights based exclusively on submitted documentation. They do not constitute an in-person physical clinical examination, emergency medical diagnosis, or a permanent physician-patient relationship. In accordance with clinical governance standards, all medical reports must be reviewed in conjunction with your primary local attending healthcare practitioner before altering ongoing therapeutic regimens.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our remote second opinion service."
            align="center"
          />
          <FAQAccordion items={secondOpinionFaqs} />
        </div>
      </Container>
    </div>
  );
};
