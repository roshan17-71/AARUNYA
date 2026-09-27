import React, { useState } from 'react';
import { Hospital } from '../../types';
import { hospitalsService } from '../../services/hospitals.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Plus,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export interface HospitalProfileFormProps {
  hospital: Hospital;
  onProfileUpdated: (updated: Hospital) => void;
}

export const HospitalProfileForm: React.FC<HospitalProfileFormProps> = ({
  hospital,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(hospital.name);
  const [city, setCity] = useState(hospital.city);
  const [country, setCountry] = useState(hospital.country || 'India');
  const [description, setDescription] = useState(hospital.description || '');

  // Array fields
  const [specialties, setSpecialties] = useState<string[]>(hospital.specialties || []);
  const [newSpecialty, setNewSpecialty] = useState('');

  const [accreditations, setAccreditations] = useState<string[]>(hospital.accreditations || []);
  const [newAccreditation, setNewAccreditation] = useState('');

  const [facilities, setFacilities] = useState<string[]>(hospital.facilities || []);
  const [newFacility, setNewFacility] = useState('');

  const [internationalServices, setInternationalServices] = useState<string[]>(
    hospital.international_patient_services || []
  );
  const [newService, setNewService] = useState('');

  // Image uploads
  const [images, setImages] = useState<string[]>(hospital.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Array item helpers
  const addItem = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputClearer: () => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setter([...list, trimmed]);
      inputClearer();
    }
  };

  const removeItem = (
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
      setErrorMessage('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    setUploadingImage(true);
    setErrorMessage(null);

    const { url, error } = await hospitalsService.uploadHospitalImage(file, hospital.id);
    setUploadingImage(false);

    if (error || !url) {
      setErrorMessage(error || 'Failed to upload hospital photo');
    } else {
      setImages((prev) => [...prev, url]);
      setSuccessMessage('Photo uploaded successfully! Remember to save profile changes.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const updates: Partial<Hospital> = {
      name: name.trim(),
      city: city.trim(),
      country: country.trim() || 'India',
      description: description.trim() || null,
      specialties,
      accreditations,
      facilities,
      international_patient_services: internationalServices,
      images,
    };

    const { data, error } = await hospitalsService.updateHospitalProfile(hospital.id, updates);
    setSaving(false);

    if (error || !data) {
      setErrorMessage(error || 'Failed to save hospital profile changes.');
    } else {
      setSuccessMessage('Hospital profile updated successfully!');
      onProfileUpdated(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status Notifications */}
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

      {/* 1. Core Hospital Details */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 space-y-4 shadow-sm">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Hospital Identity &amp; Location</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Core public identification details displayed on your institutional profile.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Hospital Legal / Trade Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Fortis Memorial Research Institute"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
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

        <div>
          <label className="text-xs font-semibold text-neutral-text block mb-1.5">
            Institutional Overview &amp; Clinical Background
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your hospital infrastructure, clinical achievements, organ transplant milestones, and international patient experience..."
            className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* 2. Accreditations & Specialties */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 space-y-6 shadow-sm">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Accreditations &amp; Clinical Specialties</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Quality seals (JCI, NABH) and departments verified by the AARUNYA clinical board.
          </p>
        </div>

        {/* Accreditations */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-text block">
            Quality Accreditations
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAccreditation}
              onChange={(e) => setNewAccreditation(e.target.value)}
              placeholder="e.g. JCI, NABH, NABL"
              className="w-full sm:w-64 text-xs py-1.5 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(newAccreditation, accreditations, setAccreditations, () => setNewAccreditation(''));
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem(newAccreditation, accreditations, setAccreditations, () => setNewAccreditation(''))}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {accreditations.map((acc, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary font-medium px-2.5 py-1 rounded-full"
              >
                {acc}
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => removeItem(idx, accreditations, setAccreditations)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Clinical Specialties */}
        <div className="space-y-2 pt-2 border-t border-neutral-border/60">
          <label className="text-xs font-semibold text-neutral-text block">
            Clinical Centers of Excellence / Specialties
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="e.g. Cardiology, Orthopedics, Oncology"
              className="w-full sm:w-64 text-xs py-1.5 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(newSpecialty, specialties, setSpecialties, () => setNewSpecialty(''));
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem(newSpecialty, specialties, setSpecialties, () => setNewSpecialty(''))}
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
                  onClick={() => removeItem(idx, specialties, setSpecialties)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 3. International Patient Services & Facilities */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 space-y-6 shadow-sm">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>International Patient Services &amp; Hospital Infrastructure</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Key amenities provided to overseas patients and family attendants.
          </p>
        </div>

        {/* International Services */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-text block">
            International Patient Desk Services
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="e.g. Medical Visa Letter, Airport Ambulance, Arabic Interpreters"
              className="w-full sm:w-80 text-xs py-1.5 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(newService, internationalServices, setInternationalServices, () => setNewService(''));
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem(newService, internationalServices, setInternationalServices, () => setNewService(''))}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {internationalServices.map((srv, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs bg-accent-light text-neutral-text font-medium px-2.5 py-1 rounded-full"
              >
                {srv}
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => removeItem(idx, internationalServices, setInternationalServices)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="space-y-2 pt-2 border-t border-neutral-border/60">
          <label className="text-xs font-semibold text-neutral-text block">
            Hospital Infrastructure &amp; Medical Facilities
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              placeholder="e.g. 800 Beds, 3T Digital MRI, Da Vinci Robotic Suite"
              className="w-full sm:w-80 text-xs py-1.5 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(newFacility, facilities, setFacilities, () => setNewFacility(''));
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem(newFacility, facilities, setFacilities, () => setNewFacility(''))}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {facilities.map((fac, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs bg-neutral-bg border border-neutral-border text-neutral-text font-medium px-2.5 py-1 rounded-full"
              >
                {fac}
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => removeItem(idx, facilities, setFacilities)}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Media & Gallery */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 space-y-4 shadow-sm">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            <span>Hospital Photos &amp; Facility Gallery</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            High-resolution images of your campus, lobby, patient suites, and operating theaters.
          </p>
        </div>

        <div className="space-y-3">
          <label className="relative inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-primary bg-primary-light border border-primary/20 rounded-button cursor-pointer hover:bg-primary-light/80 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            <span>{uploadingImage ? 'Uploading Image...' : 'Upload Campus / Facility Photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-md overflow-hidden h-28 border border-neutral-border">
                  <img src={imgUrl} alt={`Hospital media ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeItem(idx, images, setImages)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-neutral-text/70 text-white hover:bg-neutral-text transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Save Action */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-border">
        <span className="text-xs text-neutral-muted">
          Changes will reflect publicly once your hospital profile is verified and approved.
        </span>
        <Button type="submit" variant="primary" size="md" isLoading={saving}>
          Save Hospital Profile
        </Button>
      </div>
    </form>
  );
};
