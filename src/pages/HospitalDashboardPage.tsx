import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Hospital, Package } from '../types';
import { hospitalsService } from '../services/hospitals.service';
import { packagesService } from '../services/packages.service';
import { supabase } from '../lib/supabaseClient';
import { HospitalProfileForm } from '../features/hospitals/HospitalProfileForm';
import { PackageList } from '../features/hospitals/PackageList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Building2,
  Package as PackageIcon,
  ShieldCheck,
  Globe,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HospitalDashboardPage = () => {
  const { user, profile, signOut } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Setup state if no hospital row exists yet
  const [initName, setInitName] = useState('');
  const [initCity, setInitCity] = useState('');
  const [initSlug, setInitSlug] = useState('');
  const [initLoading, setInitLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const loadHospitalData = async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      const hosp = await hospitalsService.getHospitalByProfileId(profile.id);
      setHospital(hosp);

      if (hosp) {
        const pkgs = await packagesService.getHospitalPackages(hosp.id);
        setPackages(pkgs);
      }
    } catch (err) {
      console.error('[HospitalDashboard] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitalData();
  }, [profile?.id]);

  const handleInitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    if (!initName.trim() || !initCity.trim() || !initSlug.trim()) {
      setInitError('Please fill in all required fields.');
      return;
    }

    setInitLoading(true);
    setInitError(null);

    try {
      const { data, error } = await supabase
        .from('hospitals')
        .insert({
          profile_id: profile.id,
          name: initName.trim(),
          slug: initSlug.trim(),
          city: initCity.trim(),
          country: 'India',
          status: 'pending_review',
          specialties: ['General Medicine', 'Surgery'],
          accreditations: ['NABH'],
          facilities: ['24/7 Emergency', 'Intensive Care Unit (ICU)'],
          international_patient_services: ['Medical Visa Assistance', 'Airport Transfers'],
          images: [],
        })
        .select()
        .single();

      if (error) {
        setInitError(error.message);
      } else {
        setHospital(data as Hospital);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize hospital';
      setInitError(message);
    } finally {
      setInitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="w-full h-32 rounded-card" />
        <Skeleton variant="rectangular" className="w-full h-96 rounded-card" />
      </div>
    );
  }

  // If logged-in user doesn't have a linked hospital record yet, prompt them to initialize it
  if (!hospital) {
    return (
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 sm:p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-heading font-bold text-neutral-text">
              Complete Hospital Onboarding
            </h2>
            <p className="text-xs text-neutral-muted leading-relaxed">
              Welcome to the AARUNYA Hospital Network. Enter your institutional name and location to initialize your medical partner dashboard.
            </p>
          </div>

          {initError && (
            <div className="p-3 text-xs rounded-md bg-status-error/10 border border-status-error/20 text-status-error flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{initError}</span>
            </div>
          )}

          <form onSubmit={handleInitSubmit} className="space-y-4">
            <Input
              label="Hospital Name"
              placeholder="e.g. Apex Super Speciality Hospital"
              value={initName}
              onChange={(e) => {
                setInitName(e.target.value);
                const generated = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .trim()
                  .replace(/\s+/g, '-');
                setInitSlug(generated);
              }}
              required
            />

            <Input
              label="URL Slug"
              placeholder="apex-super-speciality-hospital"
              value={initSlug}
              onChange={(e) => setInitSlug(e.target.value)}
              helperText="Unique web address identifier for your public profile"
              required
            />

            <Input
              label="City in India"
              placeholder="e.g. Mumbai, New Delhi, Chennai"
              value={initCity}
              onChange={(e) => setInitCity(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center mt-2"
              isLoading={initLoading}
            >
              Initialize Hospital Profile
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Hospital['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Approved &amp; Live
          </Badge>
        );
      case 'pending_review':
        return (
          <Badge variant="warning" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Pending Accreditation Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="error" size="md">
            Review Rejected
          </Badge>
        );
      default:
        return <Badge variant="default" size="md">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {getStatusBadge(hospital.status)}
            <span className="text-xs text-neutral-muted">Hospital Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-text">
            {hospital.name}
          </h1>
          <p className="text-xs text-neutral-muted mt-1">
            {hospital.city}, {hospital.country} • Account ID: {user?.id?.slice(0, 8)}...
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hospital.status === 'approved' && (
            <Link to={`/hospitals/${hospital.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                <span>View Public Profile</span>
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Verification Notice Banner */}
      {hospital.status === 'pending_review' && (
        <div className="p-4 bg-status-warning/10 border border-status-warning/30 rounded-card text-xs text-neutral-text flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 shrink-0 text-status-warning mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-status-warning">
              Institutional Verification in Progress
            </p>
            <p className="text-neutral-muted leading-relaxed">
              Your hospital listing is currently under review by AARUNYA clinical auditors. You can edit your profile details and create packages right now. Once marked <strong>Approved</strong>, your hospital will be visible to international patients on the public directory.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Shell */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-surface border border-neutral-border rounded-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
            <PackageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Total Packages</p>
            <h3 className="text-xl font-bold text-neutral-text">{packages.length}</h3>
          </div>
        </div>

        <div className="bg-neutral-surface border border-neutral-border rounded-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-hover">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Accreditations</p>
            <h3 className="text-xl font-bold text-neutral-text">
              {hospital.accreditations?.length || 0} Listed
            </h3>
          </div>
        </div>

        <div className="bg-neutral-surface border border-neutral-border rounded-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light/50 flex items-center justify-center text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Specialty Departments</p>
            <h3 className="text-xl font-bold text-neutral-text">
              {hospital.specialties?.length || 0} Departments
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs: Profile Editor & Package Management */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Hospital Profile</span>
          </TabsTrigger>
          <TabsTrigger value="packages">
            <PackageIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>Medical Packages ({packages.length})</span>
          </TabsTrigger>
          <TabsTrigger value="inquiries">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
            <span>Inbound Quotes (Phase 10)</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <HospitalProfileForm
            hospital={hospital}
            onProfileUpdated={(updated) => setHospital(updated)}
          />
        </TabsContent>

        <TabsContent value="packages">
          <PackageList hospitalId={hospital.id} initialPackages={packages} />
        </TabsContent>

        <TabsContent value="inquiries">
          <div className="bg-neutral-surface border border-neutral-border rounded-card p-8 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-neutral-muted mx-auto" />
            <h3 className="text-base font-bold text-neutral-text">
              Patient Quote Inquiries
            </h3>
            <p className="text-xs text-neutral-muted max-w-md mx-auto">
              Inbound patient treatment requests and medical document dossier reviews will be routed directly to this inbox in Phase 10 (Treatment Quotes &amp; Packages).
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
