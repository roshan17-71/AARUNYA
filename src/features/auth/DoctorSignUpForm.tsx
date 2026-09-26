import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { CountrySelect } from '../../components/forms/CountrySelect';
import { PhoneInput } from '../../components/forms/PhoneInput';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const DoctorSignUpForm = () => {
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const specialtiesList = [
    { value: '', label: 'Select primary specialty...' },
    { value: 'Cardiology & Cardiac Surgery', label: 'Cardiology & Cardiac Surgery' },
    { value: 'Oncology & Cancer Care', label: 'Oncology & Cancer Care' },
    { value: 'Orthopedics & Joint Replacement', label: 'Orthopedics & Joint Replacement' },
    { value: 'Neurology & Neurosurgery', label: 'Neurology & Neurosurgery' },
    { value: 'Gastroenterology & Hepatology', label: 'Gastroenterology & Hepatology' },
    { value: 'Organ Transplantation', label: 'Organ Transplantation' },
    { value: 'Spine Surgery', label: 'Spine Surgery' },
    { value: 'Urology & Nephrology', label: 'Urology & Nephrology' },
    { value: 'Cosmetic & Plastic Surgery', label: 'Cosmetic & Plastic Surgery' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !specialty || !email.trim() || !password) {
      setFormError('Please fill in all required physician profile fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp({
      role: 'doctor',
      fullName: fullName.trim(),
      specialty,
      specialties: [specialty],
      qualifications: qualifications.trim(),
      experienceYears: Number(experienceYears) || 0,
      city: city.trim() || 'New Delhi',
      country,
      phoneCountryCode,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      password,
    });

    if (error) {
      setFormError(error.message || 'Failed to create doctor account.');
      setIsSubmitting(false);
      return;
    }

    // Auto-redirect to doctor dashboard
    navigate('/dashboard/doctor', { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 bg-status-error-bg border border-status-error/20 rounded-card flex items-start gap-2 text-xs text-status-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* Physician Info */}
      <Input
        label="Doctor Full Name"
        required
        placeholder="e.g. Dr. Rajesh Sharma"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Primary Medical Specialty"
          required
          options={specialtiesList}
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          disabled={isSubmitting}
        />

        <Input
          label="Years of Experience"
          type="number"
          min="0"
          max="60"
          value={experienceYears}
          onChange={(e) => setExperienceYears(Number(e.target.value))}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Degrees & Qualifications"
          placeholder="e.g. MBBS, MS, MCh (Cardio)"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          disabled={isSubmitting}
        />

        <Input
          label="Practice City"
          placeholder="e.g. New Delhi, Mumbai"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CountrySelect
          label="Country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={isSubmitting}
        />

        <PhoneInput
          label="Contact Number"
          required
          countryCode={phoneCountryCode}
          onCountryCodeChange={setPhoneCountryCode}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Email Address (Login ID)"
        type="email"
        required
        placeholder="dr.sharma@hospital.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        required
        placeholder="At least 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
        autoComplete="new-password"
      />

      {/* Approval Notice */}
      <div className="p-3 bg-status-warning-bg/70 border border-status-warning/30 rounded-card text-xs text-status-warning flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-status-warning" />
        <span className="text-neutral-text">
          <strong>Review Notice:</strong> New physician accounts enter <em>Pending Review</em> status. You can configure your consultation rates and availability right away; your profile goes live publicly once verified by AARUNYA administrators.
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center"
        isLoading={isSubmitting}
      >
        Register as Doctor
      </Button>

      <div className="text-center pt-2 text-xs text-neutral-muted">
        Already registered?{' '}
        <Link to="/signin" className="text-primary font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};

