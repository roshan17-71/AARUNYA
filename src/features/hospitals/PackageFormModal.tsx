import React, { useState, useEffect } from 'react';
import { Package } from '../../types';
import { packagesService, PackageInput } from '../../services/packages.service';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AlertCircle } from 'lucide-react';

export interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  packageToEdit?: Package | null;
  onSuccess: (savedPackage: Package) => void;
}

export const PackageFormModal: React.FC<PackageFormModalProps> = ({
  isOpen,
  onClose,
  hospitalId,
  packageToEdit,
  onSuccess,
}) => {
  const isEditing = Boolean(packageToEdit);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Preventive Health');
  const [description, setDescription] = useState('');
  const [includedServicesText, setIncludedServicesText] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [duration, setDuration] = useState('1 Day');
  const [eligibilityInfo, setEligibilityInfo] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('published');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from name if not editing
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  useEffect(() => {
    if (packageToEdit) {
      setName(packageToEdit.name);
      setSlug(packageToEdit.slug);
      setCategory(packageToEdit.category || 'Preventive Health');
      setDescription(packageToEdit.description || '');
      setIncludedServicesText(packageToEdit.included_services?.join('\n') || '');
      setEstimatedPrice(packageToEdit.estimated_price !== null ? String(packageToEdit.estimated_price) : '');
      setCurrency(packageToEdit.currency || 'USD');
      setDuration(packageToEdit.duration || '');
      setEligibilityInfo(packageToEdit.eligibility_info || '');
      setStatus(packageToEdit.status);
    } else {
      setName('');
      setSlug('');
      setCategory('Preventive Health');
      setDescription('');
      setIncludedServicesText('');
      setEstimatedPrice('');
      setCurrency('USD');
      setDuration('1 Day');
      setEligibilityInfo('');
      setStatus('published');
    }
    setError(null);
  }, [packageToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Package name is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Package URL slug is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const includedServices = includedServicesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const input: PackageInput = {
      hospital_id: hospitalId,
      name: name.trim(),
      slug: slug.trim(),
      category: category.trim(),
      description: description.trim() || null,
      included_services: includedServices,
      estimated_price: estimatedPrice.trim() ? parseFloat(estimatedPrice) : null,
      currency: currency.trim() || 'USD',
      duration: duration.trim() || null,
      eligibility_info: eligibilityInfo.trim() || null,
      status,
    };

    if (isEditing && packageToEdit) {
      const { data, error: updateError } = await packagesService.updatePackage(packageToEdit.id, input);
      setLoading(false);
      if (updateError || !data) {
        setError(updateError || 'Failed to update package');
      } else {
        onSuccess(data);
        onClose();
      }
    } else {
      const { data, error: createError } = await packagesService.createPackage(input);
      setLoading(false);
      if (createError || !data) {
        setError(createError || 'Failed to create package');
      } else {
        onSuccess(data);
        onClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Medical Package' : 'Create New Medical Package'}
      description="Create multi-service clinical or health checkup packages for international patients."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <div className="p-3 rounded-md bg-status-error/10 border border-status-error/20 flex items-start gap-2 text-xs text-status-error">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Package Name"
            placeholder="e.g. Executive Cardiac Evaluation"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <Input
            label="URL Slug"
            placeholder="executive-cardiac-evaluation"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            helperText="Lowercase letters, numbers, and dashes"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Preventive Health">Preventive Health Checkup</option>
              <option value="Cardiology">Cardiology Care</option>
              <option value="Oncology">Cancer Screening & Care</option>
              <option value="Orthopedics">Orthopedics & Joint Care</option>
              <option value="Neurosurgery">Neurology & Spine Care</option>
              <option value="Fertility & IVF">Fertility & Assisted Conception</option>
              <option value="Dental & Cosmetic">Dental & Cosmetic</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5">
              Publication Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="published">Published (Visible Publicly)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Estimated Price"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 500"
            value={estimatedPrice}
            onChange={(e) => setEstimatedPrice(e.target.value)}
          />

          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="AED">AED</option>
            </select>
          </div>

          <Input
            label="Duration"
            placeholder="e.g. 1–2 Days"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-text block mb-1.5">
            Package Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive overview of what this clinical package addresses..."
            className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-text block mb-1.5">
            Included Services & Investigations (One per line)
          </label>
          <textarea
            rows={4}
            value={includedServicesText}
            onChange={(e) => setIncludedServicesText(e.target.value)}
            placeholder="2D Echocardiogram&#10;Treadmill Stress Test (TMT)&#10;Lipid Profile Blood Test&#10;Senior Cardiologist Consultation"
            className="w-full font-mono text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p className="text-[11px] text-neutral-muted mt-1">
            Separate each clinical test, scan, or consultation on a new line.
          </p>
        </div>

        <Input
          label="Eligibility / Fasting Instructions"
          placeholder="e.g. 10–12 hours overnight fasting mandatory. Suitable for age 35+."
          value={eligibilityInfo}
          onChange={(e) => setEligibilityInfo(e.target.value)}
        />

        <div className="pt-4 border-t border-neutral-border flex justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {isEditing ? 'Save Changes' : 'Create Package'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

