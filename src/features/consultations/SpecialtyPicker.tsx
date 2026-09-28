import React from 'react';
import { SpecialtyWithCount } from '../../services/consultations.service';
import {
  Heart,
  Brain,
  Activity,
  UserCheck,
  Stethoscope,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export interface SpecialtyPickerProps {
  specialties: SpecialtyWithCount[];
  selectedSpecialty: string | null;
  onSelectSpecialty: (specialty: string) => void;
  loading: boolean;
}

export const SpecialtyPicker: React.FC<SpecialtyPickerProps> = ({
  specialties,
  selectedSpecialty,
  onSelectSpecialty,
  loading,
}) => {
  const getSpecialtyIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('cardio') || lower.includes('heart')) return Heart;
    if (lower.includes('neuro') || lower.includes('brain') || lower.includes('spine')) return Brain;
    if (lower.includes('ortho') || lower.includes('joint')) return Activity;
    if (lower.includes('oncol') || lower.includes('cancer')) return ShieldAlert;
    if (lower.includes('fertilit') || lower.includes('ivf') || lower.includes('reproduct')) return UserCheck;
    return Stethoscope;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 rounded-card bg-neutral-surface border border-neutral-border animate-pulse space-y-3">
            <div className="w-10 h-10 rounded-full bg-neutral-bg" />
            <div className="h-5 bg-neutral-bg rounded w-3/4" />
            <div className="h-4 bg-neutral-bg rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-neutral-border pb-3">
        <h3 className="text-base font-heading font-bold text-neutral-text">
          Select Clinical Specialty
        </h3>
        <p className="text-xs text-neutral-muted mt-0.5">
          Choose a medical domain to view certified specialists offering online telehealth appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((spec) => {
          const Icon = getSpecialtyIcon(spec.name);
          const isSelected = selectedSpecialty === spec.name;

          return (
            <button
              key={spec.name}
              type="button"
              onClick={() => onSelectSpecialty(spec.name)}
              className={`text-left p-5 rounded-card border transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-primary-light/40 border-primary shadow-subtle ring-2 ring-primary/20'
                  : 'bg-neutral-surface border-neutral-border hover:border-primary/40 hover:bg-neutral-bg/60'
              }`}
            >
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-primary-light text-primary group-hover:bg-primary group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-semibold text-neutral-muted bg-neutral-bg px-2 py-0.5 rounded-full border border-neutral-border">
                    {spec.doctorCount} {spec.doctorCount === 1 ? 'Specialist' : 'Specialists'}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-neutral-text group-hover:text-primary transition-colors">
                    {spec.name}
                  </h4>
                  <p className="text-xs text-neutral-muted mt-0.5">
                    Pre-travel evaluation &amp; second opinion
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-border/60 flex items-center justify-between text-xs text-primary font-medium w-full">
                <span>{isSelected ? 'Selected' : 'Choose Specialist'}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

