import React from 'react';
import { Doctor, Hospital } from '../../types';
import { Badge } from '../../components/ui/Badge';
import {
  Award,
  Building2,
  MapPin,
  CheckCircle2,
  DollarSign,
  Video,
} from 'lucide-react';

export interface DoctorPickerProps {
  doctors: (Doctor & { hospital?: Hospital | null })[];
  selectedDoctor: (Doctor & { hospital?: Hospital | null }) | null;
  onSelectDoctor: (doctor: Doctor & { hospital?: Hospital | null }) => void;
  loading: boolean;
  specialtyName: string;
}

export const DoctorPicker: React.FC<DoctorPickerProps> = ({
  doctors,
  selectedDoctor,
  onSelectDoctor,
  loading,
  specialtyName,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-card bg-neutral-surface border border-neutral-border animate-pulse space-y-3">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-neutral-bg" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-neutral-bg rounded w-3/4" />
                <div className="h-4 bg-neutral-bg rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="p-8 text-center rounded-card bg-neutral-surface border border-neutral-border space-y-2">
        <Video className="w-8 h-8 text-neutral-muted mx-auto" />
        <h4 className="text-sm font-bold text-neutral-text">
          No Telehealth Specialists Currently Listed in {specialtyName}
        </h4>
        <p className="text-xs text-neutral-muted max-w-sm mx-auto">
          Please select another clinical discipline or contact our medical desk to schedule a bespoke consultation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-neutral-border pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-heading font-bold text-neutral-text">
            Choose Your Specialist
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Showing certified department heads and chief surgeons available for teleconsultation.
          </p>
        </div>
        <Badge variant="primary" size="sm">
          {specialtyName}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doctor) => {
          const isSelected = selectedDoctor?.id === doctor.id;
          const avatarUrl =
            doctor.profile_image_url ||
            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';

          return (
            <button
              key={doctor.id}
              type="button"
              onClick={() => onSelectDoctor(doctor)}
              className={`text-left p-5 rounded-card border transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-primary-light/40 border-primary shadow-subtle ring-2 ring-primary/20'
                  : 'bg-neutral-surface border-neutral-border hover:border-primary/40'
              }`}
            >
              <div className="space-y-3 w-full">
                {/* Doctor Avatar + Name Header */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={doctor.full_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                    />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 p-0.5 bg-primary text-white rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-heading font-bold text-base text-neutral-text truncate group-hover:text-primary transition-colors">
                      {doctor.full_name}
                    </h4>
                    {doctor.qualifications && (
                      <p className="text-xs text-neutral-muted truncate">
                        {doctor.qualifications}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-neutral-muted pt-1">
                      <Award className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{doctor.experience_years}+ Years Experience</span>
                    </div>
                  </div>
                </div>

                {/* Hospital Affiliation & City */}
                <div className="space-y-1.5 pt-1 text-xs">
                  {doctor.hospital && (
                    <div className="flex items-center gap-1.5 text-neutral-text font-medium bg-neutral-bg p-2 rounded border border-neutral-border/60">
                      <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{doctor.hospital.name}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-neutral-muted pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-muted" />
                      {doctor.city}, {doctor.country}
                    </span>
                    {doctor.languages && (
                      <span className="text-[11px] truncate max-w-[120px]">
                        {doctor.languages.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Fee Strip */}
              <div className="pt-3 mt-3 border-t border-neutral-border/60 flex items-center justify-between w-full">
                <div className="flex items-center gap-1 font-bold text-sm text-neutral-text">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>${doctor.consultation_fee || 50}</span>
                  <span className="text-xs font-normal text-neutral-muted">
                    / {doctor.consultation_duration_minutes || 30} mins
                  </span>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-button transition-colors ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-neutral-bg text-neutral-text group-hover:bg-primary-light group-hover:text-primary'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Doctor'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
