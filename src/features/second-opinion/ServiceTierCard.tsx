import React from 'react';
import { Check, Clock, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SecondOpinionService } from '../../types';

interface ServiceTierCardProps {
  service: SecondOpinionService;
  isPopular?: boolean;
  isSelected?: boolean;
  onSelect?: (service: SecondOpinionService) => void;
  ctaText?: string;
}

export const ServiceTierCard: React.FC<ServiceTierCardProps> = ({
  service,
  isPopular = false,
  isSelected = false,
  onSelect,
  ctaText = 'Select Tier'
}) => {
  // Determine highlights & turnaround time based on slug
  const getTierMeta = (slug: string) => {
    switch (slug) {
      case 'clinical-review':
        return {
          turnaround: '48 – 72 Hours',
          features: [
            'Evaluation of primary diagnosis & prescription history',
            'Independent expert pharmacological review',
            'Written medical evaluation report in PDF',
            'Guidance on necessary confirmatory diagnostics'
          ]
        };
      case 'medical-record-review':
        return {
          turnaround: '3 – 4 Business Days',
          features: [
            'All features of Clinical Review included',
            'Detailed secondary radiological review (MRI/CT/PET)',
            'Histopathology & biopsy report cross-verification',
            'Surgical vs. non-surgical alternative pathways'
          ]
        };
      case 'review-video-consultation':
        return {
          turnaround: '2 – 3 Business Days',
          features: [
            'Complete clinical & imaging diagnostic evaluation',
            'Dedicated 30-minute 1-on-1 video call with super-specialist',
            'Direct discussion of doubts, prognosis & recovery goals',
            'Priority formal summary report & personalized action plan'
          ]
        };
      case 'multidisciplinary-case-review':
        return {
          turnaround: '5 – 7 Business Days',
          features: [
            'Consensus panel of 3+ accredited super-specialists',
            'Surgical Oncologist, Radiologist & Pathologist joint review',
            'Ideal for complex, rare, or disputed staging diagnoses',
            'Formal collegiate tumor/case board consensus assessment'
          ]
        };
      default:
        return {
          turnaround: '3 – 5 Days',
          features: [
            'Comprehensive clinical history review',
            'Accredited Indian specialist assessment',
            'Formal written advisory report'
          ]
        };
    }
  };

  const meta = getTierMeta(service.slug);

  return (
    <Card
      className={`relative flex flex-col justify-between transition-all duration-200 border-2 ${
        isSelected
          ? 'border-primary shadow-md ring-2 ring-primary/20'
          : isPopular
          ? 'border-accent shadow-sm'
          : 'border-neutral-border hover:border-primary/40'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="warning" className="flex items-center gap-1 shadow-sm px-3 py-0.5 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Most Popular
          </Badge>
        </div>
      )}

      <div>
        {/* Tier Header */}
        <div className="border-b border-neutral-border/70 pb-4 mb-4">
          <h3 className="text-xl font-bold text-neutral-text font-serif">
            {service.name}
          </h3>
          <p className="text-xs text-neutral-muted mt-1.5 line-clamp-2 min-h-[32px]">
            {service.description}
          </p>
        </div>

        {/* Pricing & Turnaround */}
        <div className="bg-neutral-background/70 rounded-lg p-3.5 mb-5 border border-neutral-border/60">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-neutral-muted block">Indicative Fee</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">
                  ${service.indicative_price ? service.indicative_price.toFixed(0) : '—'}
                </span>
                <span className="text-xs text-neutral-muted">USD</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-muted block">Turnaround</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-neutral-text">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{meta.turnaround}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-2.5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-muted">
            What is Included
          </p>
          <ul className="space-y-2">
            {meta.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-text/90">
                <span className="rounded-full p-0.5 bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-neutral-border/60">
        <Button
          type="button"
          variant={isSelected ? 'primary' : isPopular ? 'primary' : 'outline'}
          className="w-full flex items-center justify-center gap-2"
          onClick={() => onSelect && onSelect(service)}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              <span>Selected</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

