import React, { useState, useEffect } from 'react';
import { Doctor } from '../../types';
import { doctorsService } from '../../services/doctors.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Plus,
} from 'lucide-react';

export interface DoctorProfileFormProps {
  doctor: Doctor;
  onProfileUpdated: (updated: Doctor) => void;
}

export const DoctorProfileForm: React.FC<DoctorProfileFormProps> = ({
  doctor,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(doctor.full_name);
  const [specialty, setSpecialty] = useState(doctor.specialty);
  const [specialties, setSpecialties] = useState<string[]>(doctor.specialties || []);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [qualifications, setQualifications] = useState(doctor.qualifications || '');
  const [experienceYears, setExperienceYears] = useState(String(doctor.experience_years || ''));
  const [languages, setLanguages] = useState<string[]>(doctor.languages || []);
  const [newLanguage, setNewLanguage] = useState('');
  const [city, setCity] = useState(doctor.city);
  const [country, setCountry] = useState(doctor.country || 'India');
  const [bio, setBio] = useState(doctor.bio || '');
  const [hospitalId, setHospitalId] = useState(doctor.hospital_id || '');
  const [profileImageUrl, setProfileImageUrl] = useState(doctor.profile_image_url || '');

  const [hospitals, setHospitals] = useState<{ id: string; name: string; city: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    doctorsService.getApprovedHospitals().then((data) => setHospitals(data));
  }, []);

  const addTag = (
    val: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    clearer: () => void
  ) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setter([...list, trimmed]);
      clearer();
    }
  };

  const removeTag = (
    index: number,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    setUploadingImage(true);
    setErrorMessage(null);

    const { url, error } = await doctorsService.uploadDoctorPhoto(file, doctor.id);
    setUploadingImage(false);

    if (error || !url) {
      setErrorMessage(error || 'Failed to upload photo');
    } else {
      setProfileImageUrl(url);
      setSuccessMessage('Profile photo uploaded! Remember to save profile changes.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const updates: Partial<Doctor> = {
      full_name: fullName.trim(),
      specialty: specialty.trim(),
      specialties,
      qualifications: qualifications.trim() || null,
      experience_years: parseInt(experienceYears, 10) || 0,
      languages,
      city: city.trim(),
      country: country.trim() || 'India',
      bio: bio.trim() || null,
      hospital_id: hospitalId || null,
      profile_image_url: profileImageUrl || null,
    };

    const { data, error } = await doctorsService.updateDoctorProfile(doctor.id, updates);
    setSaving(false);

    if (error || !data) {
      setErrorMessage(error || 'Failed to update doctor profile');
    } else {
      setSuccessMessage('Doctor profile successfully updated!');
      onProfileUpdated(data);
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

      {/* 1. Identity & Credentials */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 space-y-4 shadow-sm">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>Doctor Credentials &amp; Specialty</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Public clinical identity displayed to international patients seeking specialist consultation.
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="flex items-center gap-4 py-2">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-neutral-bg">
            <img
              src={
                profileImageUrl ||
                'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
              }
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <label className="relative inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-primary bg-primary-light border border-primary/20 rounded-button cursor-pointer hover:bg-primary-light/80 transition-colors">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              <span>{uploadingImage ? 'Uploading...' : 'Upload Profile Photo'}</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
            <p className="text-[11px] text-neutral-muted mt-1">
              JPG or PNG, recommended square ratio, max 5MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Doctor Name (with Title)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="e.g. Dr. Naresh Trehan"
          />

          <Input
            label="Primary Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
            placeholder="e.g. Cardiothoracic Surgery"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Medical Qualifications &amp; Fellowships"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            placeholder="e.g. MBBS, MS, MCh (CTVS), FACS, FAMS"
            helperText="Degrees and professional society fellowships"
          />

          <Input
            label="Clinical Experience (Years)"
            type="number"
            min="0"
            max="70"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            required
            placeholder="e.g. 25"
          />
        </div>

        {/* Sub-specialties tags */}
        <div className="space-y-2 pt-2 border-t border-neutral-border/60">
          <label className="text-xs font-semibold text-neutral-text block">
            Sub-Specialties &amp; Clinical Focus Areas
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="e.g. Robotic CABG, Valve Reconstruction"
              className="w-full sm:w-80 text-xs py-1.5 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(newSpecialty, specialties, setSpecialties, () => setNewSpecialty(''));
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTag(newSpecialty, specialties, setSpecialties, () => setNewSpecialty(''))}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {specialties.map((spec, idx) => (
              <Badge key={idx} variant="default" size="sm" className="gap-1">
                {spec}
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => removeTag(idx, specialties, setSpecialties)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hospital Affiliation & Location */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 space-y-4 shadow-sm">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Hospital Affiliation &amp; Practice Location</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Primary partner hospital where you admit and perform surgeries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5">
              Affiliated Hospital
            </label>
            <select
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">No Direct Hospital Affiliation (Independent)</option>
              {hospitals.map((hosp) => (
                <option key={hosp.id} value={hosp.id}>
                  {hosp.name} ({hosp.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City in India"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="e.g. Gurugram"
            />
            <Input
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              placeholder="India"
            />
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-2 pt-2 border-t border-neutral-border/60">
          <label className="text-xs font-semibold text-neutral-text block">
            Languages Spoken with Patients
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="e.g. English, Hindi, Arabic"
              className="w-full sm:w-64 text-xs py-1.5 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(newLanguage, languages, setLanguages, () => setNewLanguage(''));
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTag(newLanguage, languages, setLanguages, () => setNewLanguage(''))}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {languages.map((lang, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary font-medium px-2.5 py-1 rounded-full"
              >
                {lang}
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => removeTag(idx, languages, setLanguages)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Biography */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-neutral-text block mb-1.5">
            Doctor Biography &amp; Surgical Background
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Highlight clinical background, overseas surgical fellowships, pioneering surgeries performed, and international patient management experience..."
            className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-border">
        <span className="text-xs text-neutral-muted">
          Profile changes will reflect publicly once your profile is verified and approved.
        </span>
        <Button type="submit" variant="primary" size="md" isLoading={saving}>
          Save Doctor Profile
        </Button>
      </div>
    </form>
  );
};

