import React, { useState } from 'react';
import { Doctor, Hospital, ConsultationSlot, Profile } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ConsultationRequestFormProps {
  doctor: Doctor & { hospital?: Hospital | null };
  slot: ConsultationSlot;
  profile: Profile | null;
  onSubmit: (patientNotes: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const ConsultationRequestForm: React.FC<ConsultationRequestFormProps> = ({
  doctor,
  slot,
  profile,
  onSubmit,
  loading,
  error,
}) => {
  const [patientNotes, setPatientNotes] = useState('');
  const [confirmedFasting, setConfirmedFasting] = useState(false);

  const startD = new Date(slot.start_time);
  const endD = new Date(slot.end_time);

  const dateStr = startD.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = `${startD.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })} – ${endD.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })} (IST)`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await onSubmit(patientNotes.trim());
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-border pb-3">
        <h3 className="text-base font-heading font-bold text-neutral-text">
          Confirm Telehealth Consultation Details
        </h3>
        <p className="text-xs text-neutral-muted mt-0.5">
          Review your appointment timing, attending physician, and enter clinical background notes.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-status-error/10 border border-status-error/20 flex items-start gap-2.5 text-xs text-status-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Appointment Summary Box */}
      <div className="p-5 rounded-card bg-neutral-surface border border-neutral-border space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-border pb-4">
          <div className="flex items-center gap-3">
            <img
              src={
                doctor.profile_image_url ||
                'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'
              }
              alt={doctor.full_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h4 className="font-heading font-bold text-base text-neutral-text">
                {doctor.full_name}
              </h4>
              <p className="text-xs text-neutral-muted">
                {doctor.specialty}
                {doctor.hospital && ` • ${doctor.hospital.name}`}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-semibold text-neutral-muted block">
              Consultation Fee
            </span>
            <div className="flex items-center sm:justify-end gap-1 font-bold text-lg text-neutral-text">
              <DollarSign className="w-4 h-4 text-primary" />
              <span>${doctor.consultation_fee || 50}</span>
              <span className="text-xs font-normal text-neutral-muted">
                / {doctor.consultation_duration_minutes || 30} mins
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-md bg-neutral-bg border border-neutral-border/60 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="text-neutral-muted block text-[11px]">Appointment Date</span>
              <strong className="text-neutral-text">{dateStr}</strong>
            </div>
          </div>

          <div className="p-3 rounded-md bg-neutral-bg border border-neutral-border/60 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            <div>
              <span className="text-neutral-muted block text-[11px]">Time Window (IST)</span>
              <strong className="text-neutral-text">{timeStr}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information & Clinical Notes */}
      {profile ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-5 rounded-card bg-neutral-surface border border-neutral-border space-y-4 shadow-sm">
            <h4 className="text-sm font-heading font-bold text-neutral-text">
              Patient Identification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Patient Name"
                value={profile.full_name || ''}
                disabled
                helperText="Verified profile name"
              />

              <Input
                label="Registered Email"
                value={profile.email || ''}
                disabled
                helperText="Video link will be dispatched to this address"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-text block mb-1.5">
                Current Condition, Symptoms &amp; Specific Questions for Dr. {doctor.full_name.replace('Dr. ', '')}
              </label>
              <textarea
                rows={4}
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Briefly describe diagnosis, ongoing medications, scans conducted (e.g. Echo, MRI), and questions you want the specialist to address..."
                className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
              />
              <p className="text-[11px] text-neutral-muted mt-1">
                You can upload full diagnostic scans and clinical dossiers securely after booking or during your second-opinion intake.
              </p>
            </div>

            <div className="p-3 rounded-md bg-primary-light/40 border border-primary/20 flex items-start gap-2.5 text-xs text-neutral-muted">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Your health data is protected under platform clinical privacy guidelines. Telehealth consultation links are generated 12–24 hours prior to appointment upon coordinator review.
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-neutral-text">
              <input
                type="checkbox"
                checked={confirmedFasting}
                onChange={(e) => setConfirmedFasting(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-neutral-border focus:ring-primary/20"
                required
              />
              <span>
                I confirm that I have access to a device with a working camera and microphone for this video consultation.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              disabled={!confirmedFasting}
              className="w-full sm:w-auto px-8"
            >
              <span>Confirm &amp; Request Video Consultation</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>
      ) : (
        /* Sign-in prompt for guest users */
        <div className="p-8 rounded-card bg-neutral-surface border border-neutral-border text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-heading font-bold text-neutral-text">
              Sign In to Complete Telehealth Booking
            </h4>
            <p className="text-xs text-neutral-muted max-w-md mx-auto leading-relaxed">
              To attach your medical records, receive encrypted telehealth video room links, and track consultation updates, please sign in or register a free patient account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/signin" state={{ from: '/video-consultation' }}>
              <Button variant="primary" size="md">
                <span>Sign In to Existing Account</span>
              </Button>
            </Link>
            <Link to="/signup/patient" state={{ from: '/video-consultation' }}>
              <Button variant="outline" size="md">
                <span>Create Free Patient Account</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

