import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorsService, DoctorWithRelations } from '../services/doctors.service';
import { ConsultationSlot } from '../types';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Video,
  Award,
  Building2,
  MapPin,
  ChevronRight,
  ArrowRight,
  Globe,
  FileText,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const DoctorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorWithRelations | null>(null);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!id) {
      setLoading(false);
      return;
    }

    doctorsService
      .getDoctorById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setDoctor(res.doctor);
          setSlots(res.slots);
        } else {
          setDoctor(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[DoctorProfilePage] Error fetching doctor:', err);
        if (!isMounted) return;
        setDoctor(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 bg-neutral-bg min-h-[70vh]">
        <Container size="md" className="space-y-6">
          <Skeleton variant="text" className="w-48 h-4" />
          <Skeleton variant="rectangular" className="w-full h-44 rounded-card" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton variant="rectangular" className="md:col-span-2 h-72 rounded-card" />
            <Skeleton variant="rectangular" className="h-72 rounded-card" />
          </div>
        </Container>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="py-20 bg-neutral-bg min-h-[60vh]">
        <Container size="sm">
          <EmptyState
            icon={AlertTriangle}
            title="Specialist Not Found"
            description="The doctor profile you requested is either not published or undergoing credential verification."
            actionLabel="Browse All Doctors"
            onAction={() => window.location.assign('/doctors')}
          />
        </Container>
      </div>
    );
  }

  const avatarUrl =
    doctor.profile_image_url ||
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';

  const formatSlot = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="py-10 sm:py-16 bg-neutral-bg min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-subtle" />
          <Link to="/doctors" className="hover:text-primary transition-colors">
            Doctors
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-subtle" />
          <span className="text-neutral-text font-medium truncate max-w-xs sm:max-w-md">
            {doctor.full_name}
          </span>
        </nav>

        {/* Doctor Header Banner */}
        <div className="rounded-card bg-neutral-surface border border-neutral-border shadow-card p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <img
                src={avatarUrl}
                alt={doctor.full_name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary/20 shadow-md"
              />
              {doctor.video_consultation_enabled && (
                <span
                  className="absolute bottom-1 right-1 p-2 bg-status-success text-white rounded-full shadow"
                  title="Available for Telehealth Consultation"
                >
                  <Video className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="primary" size="md">
                  {doctor.specialty}
                </Badge>
                {doctor.video_consultation_enabled && (
                  <span className="text-xs font-semibold text-status-success bg-status-success/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Telehealth Consultations Enabled
                  </span>
                )}
                <span className="text-xs text-neutral-muted font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  MCI / NMC Certified
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-neutral-text tracking-tight">
                {doctor.full_name}
              </h1>

              {doctor.qualifications && (
                <p className="text-xs sm:text-sm text-neutral-muted font-medium">
                  {doctor.qualifications}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-muted pt-1">
                <span className="flex items-center gap-1 font-semibold text-neutral-text">
                  <Award className="w-4 h-4 text-accent" />
                  {doctor.experience_years}+ Years Experience
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {doctor.city}, {doctor.country}
                </span>

                {doctor.languages && doctor.languages.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-neutral-muted" />
                    {doctor.languages.join(', ')}
                  </span>
                )}
              </div>

              {doctor.hospital && (
                <div className="pt-1">
                  <Link
                    to={`/hospitals/${doctor.hospital.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Practice: {doctor.hospital.name} ({doctor.hospital.city})</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Consultation Rates Card */}
            <div className="w-full sm:w-auto shrink-0 bg-neutral-bg p-4 rounded-card border border-neutral-border text-center sm:text-right space-y-2">
              {doctor.video_consultation_enabled && doctor.consultation_fee !== null ? (
                <div>
                  <span className="text-[11px] text-neutral-muted block">Video Consultation</span>
                  <div className="text-2xl font-bold text-neutral-text">
                    ${doctor.consultation_fee}
                  </div>
                  <span className="text-[11px] text-neutral-muted block">
                    Duration: {doctor.consultation_duration_minutes || 30} mins
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-medium text-neutral-text block">In-Hospital Consultation</span>
                  <span className="text-[11px] text-neutral-muted">Available via Appointment</span>
                </div>
              )}

              <Link to={`/video-consultation?doctorId=${doctor.id}`} className="block pt-1">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  <Video className="w-3.5 h-3.5 mr-1.5" />
                  <span>Book Consultation</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Doctor Details Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Bio & Overview */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Doctor Biography &amp; Clinical Experience</span>
              </h2>
              <div className="text-xs sm:text-sm text-neutral-muted leading-relaxed whitespace-pre-line">
                {doctor.bio ||
                  `${doctor.full_name} is an eminent ${doctor.specialty} specialist practicing in ${doctor.city}, India, with over ${doctor.experience_years} years of surgical and clinical excellence treating international patients.`}
              </div>
            </Card>

            {/* 2. Sub-specialties */}
            {doctor.specialties && doctor.specialties.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                  <span>Sub-Specialties &amp; Clinical Focus</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialties.map((spec) => (
                    <Badge key={spec} variant="primary" size="md">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* 3. Available Telehealth Slots */}
            {doctor.video_consultation_enabled && (
              <Card className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-bold text-neutral-text flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Upcoming Available Video Consultation Slots</span>
                  </h3>
                  <span className="text-xs text-neutral-muted">
                    {slots.length} available {slots.length === 1 ? 'slot' : 'slots'}
                  </span>
                </div>

                {slots.length === 0 ? (
                  <p className="text-xs text-neutral-muted py-3">
                    No upcoming open slots listed at the moment. Please request an appointment through our medical concierge desk below.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const start = formatSlot(slot.start_time);
                      const end = formatSlot(slot.end_time);

                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-card bg-neutral-bg border border-neutral-border flex items-center justify-between"
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-neutral-text block">
                              {start.date}
                            </span>
                            <span className="text-[11px] text-neutral-muted flex items-center gap-1">
                              <Clock className="w-3 h-3 text-accent" />
                              {start.time} – {end.time} (IST)
                            </span>
                          </div>

                          <Link to={`/video-consultation?doctorId=${doctor.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              Select Slot
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* 4. Affiliated Hospital Card */}
            {doctor.hospital && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>Primary Surgical Center</span>
                </h3>
                <div className="p-4 rounded-card bg-neutral-bg border border-neutral-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-bold text-base text-neutral-text">
                      {doctor.hospital.name}
                    </h4>
                    <p className="text-xs text-neutral-muted mt-0.5">
                      {doctor.hospital.city}, {doctor.hospital.country} • Accreditations:{' '}
                      {doctor.hospital.accreditations?.join(', ')}
                    </p>
                  </div>
                  <Link to={`/hospitals/${doctor.hospital.slug}`} className="shrink-0">
                    <Button variant="outline" size="sm">
                      View Hospital Profile
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Right Sticky Sidebar: Action Rails */}
          <div className="space-y-6">
            {/* Second Opinion Referral */}
            <Card className="p-6 bg-primary-light/50 border-primary/20 space-y-4">
              <div className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-text">
                  Direct Second Opinion
                </h4>
                <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                  Have {doctor.full_name} review your clinical records, scans, and biopsy reports for expert validation before traveling.
                </p>
              </div>
              <Link to="/second-opinion">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Request Second Opinion
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </Card>

            {/* Case Coordinator Assistance */}
            <Card className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-md bg-accent-light flex items-center justify-center text-accent-hover">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-text">
                  Talk to Care Advisor
                </h4>
                <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                  Need help coordinating an emergency consultation, interpreter booking, or visa invitation letter?
                </p>
              </div>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Contact Care Coordinator
                </Button>
              </Link>
            </Card>

            {/* Verification Note */}
            <div className="p-4 rounded-card bg-neutral-bg border border-neutral-border text-xs text-neutral-muted space-y-2">
              <p className="font-semibold text-neutral-text flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Verified Credentials</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                All listed specialists are authenticated against the National Medical Commission (NMC) registry and affiliated with JCI/NABH accredited hospitals.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

