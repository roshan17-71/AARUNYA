import React, { useState } from 'react';
import { Doctor } from '../../types';
import { doctorsService } from '../../services/doctors.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Video, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ConsultationSettingsFormProps {
  doctor: Doctor;
  onSettingsUpdated: (updated: Doctor) => void;
}

export const ConsultationSettingsForm: React.FC<ConsultationSettingsFormProps> = ({
  doctor,
  onSettingsUpdated,
}) => {
  const [videoEnabled, setVideoEnabled] = useState(doctor.video_consultation_enabled);
  const [fee, setFee] = useState<string>(
    doctor.consultation_fee !== null ? String(doctor.consultation_fee) : '50'
  );
  const [duration, setDuration] = useState<number>(
    doctor.consultation_duration_minutes || 30
  );

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const parsedFee = fee.trim() ? parseFloat(fee) : null;

    const { data, error } = await doctorsService.updateConsultationSettings(doctor.id, {
      video_consultation_enabled: videoEnabled,
      consultation_fee: parsedFee,
      consultation_duration_minutes: duration,
    });

    setSaving(false);

    if (error || !data) {
      setErrorMessage(error || 'Failed to update consultation settings');
    } else {
      setSuccessMessage('Telehealth consultation settings saved successfully!');
      onSettingsUpdated(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="p-4 rounded-md bg-status-success/10 border border-status-success/20 flex items-center gap-2 text-xs text-status-success font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-md bg-status-error/10 border border-status-error/20 flex items-center gap-2 text-xs text-status-error font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 space-y-6 shadow-sm">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            <span>Telehealth Video Consultation Settings</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Configure online video appointment availability, consultation duration, and pricing for overseas patients.
          </p>
        </div>

        {/* Video Toggle */}
        <div className="p-4 rounded-md bg-neutral-bg border border-neutral-border flex items-start gap-4">
          <input
            type="checkbox"
            id="video-toggle"
            checked={videoEnabled}
            onChange={(e) => setVideoEnabled(e.target.checked)}
            className="w-4 h-4 text-primary rounded border-neutral-border focus:ring-primary/20 mt-1 cursor-pointer"
          />
          <div>
            <label htmlFor="video-toggle" className="text-xs font-bold text-neutral-text cursor-pointer block">
              Enable Video Consultations on AARUNYA Platform
            </label>
            <p className="text-xs text-neutral-muted mt-0.5 leading-relaxed">
              When checked, your profile displays the "Video Consultation Available" badge, and patients can book appointments against your published slots.
            </p>
          </div>
        </div>

        {/* Fee & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span>Consultation Fee (USD)</span>
            </label>
            <Input
              type="number"
              min="0"
              step="5"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="e.g. 50"
              helperText="Standard professional fee per video session in USD"
              required={videoEnabled}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Session Duration</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes (Recommended)</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (Comprehensive Review)</option>
            </select>
            <p className="text-[11px] text-neutral-muted mt-1">
              Standard appointment duration allocated per patient.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-neutral-border">
        <Button type="submit" variant="primary" size="md" isLoading={saving}>
          Save Consultation Settings
        </Button>
      </div>
    </form>
  );
};

