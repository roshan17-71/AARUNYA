import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CountrySelect } from '../../components/forms/CountrySelect';
import { PhoneInput } from '../../components/forms/PhoneInput';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const HospitalSignUpForm = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [specialtiesText, setSpecialtiesText] = useState('Cardiology, Oncology, Orthopedics, Neurology');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!hospitalName.trim() || !city.trim() || !email.trim() || !password) {
      setFormError('Please fill in all required hospital details.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    const parsedSpecialties = specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    const { error } = await signUp({
      role: 'hospital',
      fullName: hospitalName.trim(),
      city: city.trim(),
      country,
      specialties: parsedSpecialties,
      specialty: parsedSpecialties[0] || 'Multi-specialty',
      phoneCountryCode,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      password,
    });

    if (error) {
      setFormError(error.message || 'Failed to create hospital account.');
      setIsSubmitting(false);
      return;
    }

    // Auto-redirect to hospital dashboard
    navigate('/dashboard/hospital', { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 bg-status-error-bg border border-status-error/20 rounded-card flex items-start gap-2 text-xs text-status-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <Input
        label="Hospital / Medical Center Name"
        required
        placeholder="e.g. Fortis Memorial Research Institute"
        value={hospitalName}
        onChange={(e) => setHospitalName(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City / Location"
          required
          placeholder="e.g. Gurugram, Delhi NCR"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isSubmitting}
        />

        <CountrySelect
          label="Country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Departments / Specialties (Comma-separated)"
        required
        placeholder="Cardiology, Oncology, Orthopedics, Neurology"
        helperText="Enter key clinical specialties offered to international patients."
        value={specialtiesText}
        onChange={(e) => setSpecialtiesText(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PhoneInput
          label="International Patient Desk Phone"
          required
          countryCode={phoneCountryCode}
          onCountryCodeChange={setPhoneCountryCode}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          disabled={isSubmitting}
        />

        <Input
          label="Official Email Address (Login)"
          type="email"
          required
          placeholder="ipd@hospital.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          autoComplete="email"
        />
      </div>

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

      {/* Approval notice */}
      <div className="p-3 bg-status-warning-bg/70 border border-status-warning/30 rounded-card text-xs text-status-warning flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-status-warning" />
        <span className="text-neutral-text">
          <strong>Review Notice:</strong> Hospital accounts enter <em>Pending Review</em> status. You can draft packages and upload facility accreditations immediately; public listings go live after admin verification.
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center"
        isLoading={isSubmitting}
      >
        Register Hospital Facility
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

