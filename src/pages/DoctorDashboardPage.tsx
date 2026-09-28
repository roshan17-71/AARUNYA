import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Doctor } from '../types';
import { doctorsService, DoctorWithRelations } from '../services/doctors.service';
import { supabase } from '../lib/supabaseClient';
import { DoctorProfileForm } from '../features/doctors/DoctorProfileForm';
import { ConsultationSettingsForm } from '../features/doctors/ConsultationSettingsForm';
import { AvailabilitySlotManager } from '../features/doctors/AvailabilitySlotManager';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Stethoscope,
  Calendar,
  DollarSign,
  Video,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboardPage = () => {
  const { profile, signOut } = useAuth();
  const [doctor, setDoctor] = useState<DoctorWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  // Setup state if no doctor row exists yet
  const [initName, setInitName] = useState(profile?.full_name || '');
  const [initSpecialty, setInitSpecialty] = useState('');
  const [initCity, setInitCity] = useState('');
  const [initExp, setInitExp] = useState('10');
  const [initLoading, setInitLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const loadDoctorData = async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      const doc = await doctorsService.getDoctorByProfileId(profile.id);
      setDoctor(doc);
    } catch (err) {
      console.error('[DoctorDashboard] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [profile?.id]);

  const handleInitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    if (!initName.trim() || !initSpecialty.trim() || !initCity.trim()) {
      setInitError('Please fill in all required fields.');
      return;
    }

    setInitLoading(true);
    setInitError(null);

    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert({
          profile_id: profile.id,
          full_name: initName.trim(),
          specialty: initSpecialty.trim(),
          specialties: [initSpecialty.trim()],
          city: initCity.trim(),
          country: 'India',
          experience_years: parseInt(initExp, 10) || 5,
          languages: ['English', 'Hindi'],
          status: 'pending_review',
          video_consultation_enabled: true,
          consultation_fee: 50,
          consultation_duration_minutes: 30,
        })
        .select('*, hospital:hospitals(*)')
        .single();

      if (error) {
        setInitError(error.message);
      } else {
        setDoctor(data as DoctorWithRelations);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize doctor profile';
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

  // Prompt onboarding setup if no doctor row exists
  if (!doctor) {
    return (
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 sm:p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-heading font-bold text-neutral-text">
              Complete Physician Registration
            </h2>
            <p className="text-xs text-neutral-muted leading-relaxed">
              Welcome to the AARUNYA Physician Panel. Provide your primary medical specialty and city to initialize your doctor console.
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
              label="Doctor Full Name"
              placeholder="e.g. Dr. Rajesh Sharma"
              value={initName}
              onChange={(e) => setInitName(e.target.value)}
              required
            />

            <Input
              label="Primary Specialty"
              placeholder="e.g. Cardiology, Neurosurgery, Orthopedics"
              value={initSpecialty}
              onChange={(e) => setInitSpecialty(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City in India"
                placeholder="e.g. Gurugram, Delhi, Chennai"
                value={initCity}
                onChange={(e) => setInitCity(e.target.value)}
                required
              />

              <Input
                label="Years of Experience"
                type="number"
                min="0"
                value={initExp}
                onChange={(e) => setInitExp(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center mt-2"
              isLoading={initLoading}
            >
              Initialize Doctor Profile
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Doctor['status']) => {
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
            Pending Credential Verification
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="error" size="md">
            Verification Rejected
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
            {getStatusBadge(doctor.status)}
            <span className="text-xs text-neutral-muted">Physician Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-text">
            {doctor.full_name}
          </h1>
          <p className="text-xs text-neutral-muted mt-1">
            {doctor.specialty} • {doctor.city}, {doctor.country}
            {doctor.hospital && ` • ${doctor.hospital.name}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {doctor.status === 'approved' && (
            <Link to={`/doctors/${doctor.id}`} target="_blank">
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
      {doctor.status === 'pending_review' && (
        <div className="p-4 bg-status-warning/10 border border-status-warning/30 rounded-card text-xs text-neutral-text flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 shrink-0 text-status-warning mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-status-warning">
              Credential Verification in Progress
            </p>
            <p className="text-neutral-muted leading-relaxed">
              Your physician listing is currently undergoing administrative verification against state medical registers. You can edit your bio, set your consultation fee, and manage availability slots now. Once marked <strong>Approved</strong>, your profile will be publicly discoverable.
            </p>
          </div>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-surface border border-neutral-border rounded-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Experience</p>
            <h3 className="text-xl font-bold text-neutral-text">{doctor.experience_years} Years</h3>
          </div>
        </div>

        <div className="bg-neutral-surface border border-neutral-border rounded-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-status-success/15 flex items-center justify-center text-status-success">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Telehealth Status</p>
            <h3 className="text-sm font-bold text-neutral-text">
              {doctor.video_consultation_enabled ? 'Active' : 'Disabled'}
            </h3>
          </div>
        </div>

        <div className="bg-neutral-surface border border-neutral-border rounded-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-hover">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-muted">Consultation Rate</p>
            <h3 className="text-xl font-bold text-neutral-text">
              ${doctor.consultation_fee || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
            <span>Doctor Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Video className="w-3.5 h-3.5 mr-1.5" />
            <span>Telehealth Settings</span>
          </TabsTrigger>
          <TabsTrigger value="slots">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>Availability Slots</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <DoctorProfileForm
            doctor={doctor}
            onProfileUpdated={(updated) => setDoctor((prev) => ({ ...prev, ...updated }))}
          />
        </TabsContent>

        <TabsContent value="settings">
          <ConsultationSettingsForm
            doctor={doctor}
            onSettingsUpdated={(updated) => setDoctor((prev) => ({ ...prev, ...updated }))}
          />
        </TabsContent>

        <TabsContent value="slots">
          <AvailabilitySlotManager doctorId={doctor.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
