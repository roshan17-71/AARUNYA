import { Container } from '../../components/layout/Container';
import { Building2, Stethoscope, Users, Award } from 'lucide-react';

export const StatBand = () => {
  const stats = [
    {
      label: 'Accredited Hospitals',
      value: '500+',
      description: 'NABH & JCI Quality Standards',
      icon: Building2,
    },
    {
      label: 'Verified Specialists',
      value: '2,500+',
      description: 'Department Heads & Surgeons',
      icon: Stethoscope,
    },
    {
      label: 'International Patients',
      value: '50,000+',
      description: 'Guided Across 40+ Nations',
      icon: Users,
    },
    {
      label: 'Clinical Excellence',
      value: '98%',
      description: 'Patient Satisfaction Score',
      icon: Award,
    },
  ];

  return (
    <section className="py-12 bg-neutral-surface border-y border-neutral-border">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4 p-2">
                <div className="w-12 h-12 rounded-card bg-primary-light flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-text">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-text mt-0.5">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-neutral-muted mt-0.5">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

