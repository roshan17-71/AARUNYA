import { Link } from 'react-router-dom';
import { DoctorWithRelations } from '../../services/doctors.service';
import { Card, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Video,
  Award,
  Building2,
  MapPin,
  ArrowRight,
  Globe,
  Stethoscope,
} from 'lucide-react';

export interface DoctorCardProps {
  doctor: DoctorWithRelations;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const avatarUrl =
    doctor.profile_image_url ||
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';

  return (
    <Card hoverEffect className="flex flex-col justify-between h-full bg-neutral-surface border-neutral-border overflow-hidden group">
      <div className="p-5 pb-3 space-y-3.5">
        {/* Top Header Row: Avatar + Telehealth & Experience Badges */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt={doctor.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors shadow-sm"
              loading="lazy"
            />
            {doctor.video_consultation_enabled && (
              <span
                className="absolute -bottom-0.5 -right-0.5 p-1 bg-status-success text-white rounded-full shadow"
                title="Available for Telehealth Consultation"
              >
                <Video className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {doctor.video_consultation_enabled && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success bg-status-success/10 border border-status-success/20 px-2 py-0.5 rounded-full">
                <Video className="w-3 h-3" />
                <span>Telehealth</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-muted bg-neutral-bg px-2 py-0.5 rounded-full border border-neutral-border">
              <Award className="w-3 h-3 text-accent shrink-0" />
              <span>{doctor.experience_years}+ Yrs Exp</span>
            </span>
          </div>
        </div>

        {/* Doctor Name & Qualifications taking Full Card Width */}
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-heading font-bold text-neutral-text line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            <Link to={`/doctors/${doctor.id}`}>{doctor.full_name}</Link>
          </CardTitle>

          {doctor.qualifications && (
            <p className="text-xs text-neutral-muted line-clamp-2 leading-relaxed">
              {doctor.qualifications}
            </p>
          )}
        </div>

        {/* Clinical Specialty Badge */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <Badge variant="primary" size="sm" className="max-w-full text-left font-semibold">
            {doctor.specialty}
          </Badge>
        </div>

        {/* Hospital Affiliation */}
        {doctor.hospital && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-text font-medium bg-neutral-bg p-2 rounded-md border border-neutral-border/60">
            <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{doctor.hospital.name}</span>
          </div>
        )}

        {/* City & Spoken Languages */}
        <div className="flex items-center justify-between text-xs text-neutral-muted pt-0.5">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-neutral-muted shrink-0" />
            <span className="truncate">{doctor.city}, {doctor.country}</span>
          </span>

          {doctor.languages && doctor.languages.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] shrink-0 text-neutral-muted">
              <Globe className="w-3 h-3 text-neutral-muted shrink-0" />
              <span>{doctor.languages.slice(0, 2).join(', ')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Footer with Fee and Action */}
      <CardFooter className="p-4 border-t border-neutral-border flex items-center justify-between gap-3 bg-neutral-surface">
        <div>
          {doctor.video_consultation_enabled && doctor.consultation_fee !== null ? (
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-muted block">
                Consultation Fee
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-neutral-text">
                  ${doctor.consultation_fee}
                </span>
                <span className="text-[10px] text-neutral-muted">
                  / {doctor.consultation_duration_minutes || 30} min
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-neutral-muted flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-primary" />
              In-Hospital Care
            </span>
          )}
        </div>

        <Link to={`/doctors/${doctor.id}`}>
          <Button variant="outline" size="sm" className="group-hover:border-primary group-hover:text-primary transition-colors">
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
