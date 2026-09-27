import { TreatmentFaq } from '../../types';
import { FAQAccordion } from '../../components/ui/FAQAccordion';
import { HelpCircle } from 'lucide-react';

export interface TreatmentFAQProps {
  faqs?: TreatmentFaq[];
  treatmentName: string;
}

export const TreatmentFAQ = ({ faqs, treatmentName }: TreatmentFAQProps) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-5 h-5 text-primary shrink-0" />
        <h3 className="text-xl font-heading font-bold text-neutral-text">
          Frequently Asked Questions about {treatmentName}
        </h3>
      </div>
      <p className="text-xs text-neutral-muted mb-4">
        Clear answers regarding clinical preparation, surgical success rates, and recovery periods.
      </p>
      <FAQAccordion items={faqs} />
    </div>
  );
};

