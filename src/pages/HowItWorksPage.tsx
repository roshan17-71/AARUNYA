import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Search,
  FileCheck2,
  Plane,
  HeartPulse,
  ShieldCheck,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover Treatments & Accredited Hospitals',
      description:
        'Browse our verified directory of over 500 NABH and JCI-accredited medical centers across India. Filter by clinical specialty, procedure type, or destination city. Compare hospital facilities, intensive care capabilities, and physician accreditations.',
      icon: Search,
      benefits: ['Verified hospital credentials', 'Clear indication of accreditations', 'Comprehensive procedure overviews'],
    },
    {
      num: '02',
      title: 'Second Medical Opinion & Formal Quote',
      description:
        'Upload your current diagnostic reports, MRI/CT scans, and physician summaries through our encrypted portal. Certified Indian department heads review your case and issue a formal clinical second opinion and transparent, itemized procedure cost estimate.',
      icon: FileCheck2,
      benefits: ['Confidential document storage', 'Expert review within 48–72 hours', 'No hidden or surprise charges'],
    },
    {
      num: '03',
      title: 'Medical Visa & Travel Assistance',
      description:
        'Once you accept your treatment plan, AARUNYA procures your formal Medical Visa Invitation Letter from the hospital to expedite your Indian e-Medical Visa. We coordinate airport pickup, local SIM cards, currency exchange guidance, and nearby accommodation.',
      icon: Plane,
      benefits: ['Hospital visa invitation letter', 'Dedicated airport assistance', 'Curated patient-friendly hotels'],
    },
    {
      num: '04',
      title: 'Hospital Admission, Surgery & Recovery',
      description:
        'Upon arrival at the hospital, your personal international patient coordinator accompanies you through pre-op assessments, admission, procedure, and post-operative recovery. After discharge, we maintain post-travel follow-ups with your operating surgeon.',
      icon: HeartPulse,
      benefits: ['Personal multilingual coordinator', 'Direct surgeon consultations', 'Post-discharge teleconsultation support'],
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-neutral-bg space-y-16">
      <Container>
        {/* Page Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="primary" size="md">Patient Journey</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-text">
            How AARUNYA Works
          </h1>
          <p className="text-sm sm:text-base text-neutral-muted leading-relaxed">
            From your very first symptom search to your safe return home, we ensure your healthcare journey in India is transparent, comfortable, and clinically sound.
          </p>
        </div>

        {/* Detailed 4-Step Cards */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Card key={idx} className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-14 h-14 rounded-card bg-primary-light flex items-center justify-center text-primary shrink-0 font-bold text-xl">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 bg-accent-light rounded">
                        STEP {s.num}
                      </span>
                      <h3 className="text-xl font-bold text-neutral-text">{s.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed">
                      {s.description}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      {s.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-text">
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Coordination Commitment Banner */}
        <div className="mt-16 p-8 rounded-card bg-neutral-surface border border-neutral-border max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold text-neutral-text flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Dedicated International Patient Desks</span>
            </h4>
            <p className="text-xs text-neutral-muted max-w-lg leading-relaxed">
              Every patient is assigned an individual case coordinator who coordinates consultations, translation, and logistics free of charge.
            </p>
          </div>
          <Link to="/contact">
            <Button variant="primary" size="md" className="shrink-0">
              <Headphones className="w-4 h-4 mr-1.5" />
              <span>Speak to an Advisor</span>
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

