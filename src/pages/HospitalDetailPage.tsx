import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Hospital, Treatment, Package } from '../types';
import { hospitalsService } from '../services/hospitals.service';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Building2,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  FileText,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Award,
  Box,
  Clock,
  DollarSign,
  Activity,
} from 'lucide-react';

export const HospitalDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!slug) {
      setLoading(false);
      return;
    }

    hospitalsService
      .getHospitalBySlug(slug)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setHospital(res.hospital);
          setTreatments(res.treatments);
          setPackages(res.packages);
        } else {
          setHospital(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[HospitalDetailPage] Error fetching hospital:', err);
        if (!isMounted) return;
        setHospital(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

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

  if (!hospital) {
    return (
      <div className="py-20 bg-neutral-bg min-h-[60vh]">
        <Container size="sm">
          <EmptyState
            icon={AlertTriangle}
            title="Hospital Not Found"
            description="The medical institution you are looking for is either not published or undergoing accreditation review."
            actionLabel="Browse All Hospitals"
            onAction={() => window.location.assign('/hospitals')}
          />
        </Container>
      </div>
    );
  }

  const coverImage =
    hospital.images && hospital.images.length > 0
      ? hospital.images[0]
      : 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="py-10 sm:py-16 bg-neutral-bg min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-subtle" />
          <Link to="/hospitals" className="hover:text-primary transition-colors">
            Hospitals
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-subtle" />
          <span className="text-neutral-text font-medium truncate max-w-xs sm:max-w-md">
            {hospital.name}
          </span>
        </nav>

        {/* Hero Header Banner */}
        <div className="rounded-card bg-neutral-surface border border-neutral-border shadow-card overflow-hidden mb-10">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-subtle/20">
            <img
              src={coverImage}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-text/90 via-neutral-text/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {hospital.accreditations?.map((acc) => (
                  <span
                    key={acc}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-white text-primary px-2.5 py-0.5 rounded shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    {acc}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-black/40 text-neutral-light px-2.5 py-0.5 rounded backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {hospital.city}, {hospital.country}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white tracking-tight">
                {hospital.name}
              </h1>
            </div>
          </div>

          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-border bg-neutral-surface">
            <div className="text-xs text-neutral-muted flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent" />
              <span>Verified partner institution in the AARUNYA Global Clinical Network</span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/contact">
                <Button variant="primary" size="sm">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  <span>Request Treatment Quote</span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="sm">
                  <Headphones className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  <span>Talk to Advisor</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Hospital Details Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Overview */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>About {hospital.name}</span>
              </h2>
              <div className="text-xs sm:text-sm text-neutral-muted leading-relaxed whitespace-pre-line">
                {hospital.description ||
                  `${hospital.name} is a premier healthcare institution in ${hospital.city}, India, recognized for state-of-the-art medical technology, board-certified surgeons, and international patient coordination.`}
              </div>
            </Card>

            {/* 2. Clinical Specialties */}
            {hospital.specialties && hospital.specialties.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Centers of Clinical Excellence</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((spec) => (
                    <Badge key={spec} variant="primary" size="md">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* 3. International Patient Services */}
            {hospital.international_patient_services && hospital.international_patient_services.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-status-success" />
                  <span>Dedicated International Patient Services</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hospital.international_patient_services.map((service, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md bg-neutral-bg border border-neutral-border text-xs text-neutral-text flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 4. Infrastructure & Medical Facilities */}
            {hospital.facilities && hospital.facilities.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  <span>Hospital Infrastructure &amp; Medical Facilities</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hospital.facilities.map((facility, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md bg-neutral-bg border border-neutral-border text-xs text-neutral-text flex items-center gap-2.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 5. Medical Checkup & Surgical Packages */}
            {packages && packages.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-primary" />
                  <span>Medical Packages &amp; Checkups</span>
                </h3>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-card bg-neutral-bg border border-neutral-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-text">
                            {pkg.name}
                          </span>
                          <span className="text-[10px] bg-primary-light text-primary font-medium px-2 py-0.5 rounded">
                            {pkg.category}
                          </span>
                        </div>
                        {pkg.description && (
                          <p className="text-xs text-neutral-muted line-clamp-2">
                            {pkg.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-neutral-muted pt-1">
                          {pkg.estimated_price !== null && (
                            <span className="font-semibold text-neutral-text flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-primary" />
                              {pkg.currency} {pkg.estimated_price.toLocaleString()}
                            </span>
                          )}
                          {pkg.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-accent" />
                              {pkg.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link to="/contact" className="shrink-0">
                        <Button variant="outline" size="sm">
                          Book Package
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 6. Linked Accredited Treatments */}
            {treatments && treatments.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Key Medical Procedures Performed</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {treatments.map((treatment) => (
                    <Link
                      key={treatment.id}
                      to={`/treatments/${treatment.slug}`}
                      className="p-4 rounded-card bg-neutral-bg border border-neutral-border hover:border-primary/40 transition-colors block group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-text group-hover:text-primary transition-colors">
                          {treatment.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-muted group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-[11px] text-neutral-muted block mt-1">
                        {treatment.specialty} • {treatment.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* 7. Image Gallery (if multiple photos available) */}
            {hospital.images && hospital.images.length > 1 && (
              <Card className="p-6 sm:p-8">
                <h3 className="text-lg font-heading font-bold text-neutral-text mb-4">
                  Hospital &amp; Campus Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hospital.images.map((img, idx) => (
                    <div key={idx} className="h-32 rounded-md overflow-hidden border border-neutral-border">
                      <img
                        src={img}
                        alt={`${hospital.name} view ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sticky Sidebar: Assistance & Action Cards */}
          <div className="space-y-6">
            {/* Free Quote Banner */}
            <Card className="p-6 bg-primary-light/50 border-primary/20 space-y-4">
              <div className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-text">
                  Direct Hospital Quotation
                </h4>
                <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                  Submit medical scans directly to {hospital.name} international patient department for formal case evaluation.
                </p>
              </div>
              <Link to="/contact">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Request Official Estimate
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </Card>

            {/* Dedicated Coordinator Support */}
            <Card className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-md bg-accent-light flex items-center justify-center text-accent-hover">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-text">
                  International Concierge
                </h4>
                <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                  Need airport ambulance pickup, hotel stay coordination, or visa invitation letters for your treatment trip?
                </p>
              </div>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Connect with Patient Desk
                </Button>
              </Link>
            </Card>

            {/* Accreditations Trust Panel */}
            <div className="p-4 rounded-card bg-neutral-bg border border-neutral-border text-xs text-neutral-muted space-y-2">
              <p className="font-semibold text-neutral-text flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Accreditation Verification</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Hospital accreditations (JCI / NABH) are authenticated by the AARUNYA clinical audit board. Quality standards are re-verified on an annual basis.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

