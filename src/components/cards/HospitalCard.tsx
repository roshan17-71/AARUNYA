import { Link } from 'react-router-dom';
import { Hospital } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, ShieldCheck, ArrowRight, Building2, Globe } from 'lucide-react';

export interface HospitalCardProps {
  hospital: Hospital;
}

export const HospitalCard = ({ hospital }: HospitalCardProps) => {
  const coverImage =
    hospital.images && hospital.images.length > 0
      ? hospital.images[0]
      : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';

  return (
    <Card hoverEffect className="flex flex-col justify-between h-full bg-neutral-surface border-neutral-border overflow-hidden group">
      <div>
        {/* Hospital Exterior / Thumbnail Image */}
        <div className="relative h-48 w-full overflow-hidden bg-neutral-subtle/20">
          <img
            src={coverImage}
            alt={hospital.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {hospital.accreditations && hospital.accreditations.map((acc) => (
              <span
                key={acc}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/95 text-primary px-2 py-0.5 rounded shadow-sm backdrop-blur-sm"
              >
                <ShieldCheck className="w-3 h-3 text-primary" />
                {acc}
              </span>
            ))}
          </div>
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-neutral-text/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-accent" />
              {hospital.city}, {hospital.country}
            </span>
          </div>
        </div>

        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-lg font-heading font-bold text-neutral-text line-clamp-1 group-hover:text-primary transition-colors">
            <Link to={`/hospitals/${hospital.slug}`}>{hospital.name}</Link>
          </CardTitle>

          <CardDescription className="text-xs text-neutral-muted line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
            {hospital.description || `Accredited multi-speciality tertiary hospital in ${hospital.city}, India.`}
          </CardDescription>
        </CardHeader>

        {/* Clinical Specialties */}
        <div className="px-6 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-subtle mb-1.5 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            Key Specialties
          </p>
          <div className="flex flex-wrap gap-1.5">
            {hospital.specialties && hospital.specialties.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="default" size="sm">
                {spec}
              </Badge>
            ))}
            {hospital.specialties && hospital.specialties.length > 3 && (
              <span className="text-[10px] text-neutral-muted self-center font-medium">
                +{hospital.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* International Patient Support Highlights */}
        {hospital.international_patient_services && hospital.international_patient_services.length > 0 && (
          <div className="px-6 py-2 border-t border-neutral-border/60 mt-2">
            <p className="text-[11px] text-neutral-muted flex items-center gap-1 line-clamp-1">
              <Globe className="w-3 h-3 text-status-success shrink-0" />
              <span>{hospital.international_patient_services.slice(0, 2).join(' • ')}</span>
            </p>
          </div>
        )}
      </div>

      <CardFooter className="pt-4 border-t border-neutral-border flex items-center justify-between gap-3">
        <Link to={`/hospitals/${hospital.slug}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full justify-center group-hover:border-primary group-hover:text-primary transition-colors">
            <span>View Hospital Profile</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

