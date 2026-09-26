import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CountrySelect } from '../../components/forms/CountrySelect';
import { PhoneInput } from '../../components/forms/PhoneInput';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const PatientSignUpForm = () => {
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('India');
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

    if (!fullName.trim() || !email.trim() || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp({
      role: 'patient',
      fullName: fullName.trim(),
      country,
      phoneCountryCode,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      password,
    });

    if (error) {
      setFormError(error.message || 'Failed to create patient account.');
      setIsSubmitting(false);
      return;
    }

    // Auto-redirect to patient dashboard
    navigate('/dashboard/patient', { replace: true });
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
        label="Full Name"
        required
        placeholder="e.g. Sarah Jenkins"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CountrySelect
          label="Your Country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={isSubmitting}
        />

        <PhoneInput
          label="Phone / WhatsApp"
          required
          countryCode={phoneCountryCode}
          onCountryCodeChange={setPhoneCountryCode}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        required
        placeholder="sarah@example.com"
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

      <div className="p-3 bg-neutral-bg border border-neutral-border rounded-card text-xs text-neutral-muted flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span>
          Your data is strictly confidential. Medical documents and consultation notes are encrypted.
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center"
        isLoading={isSubmitting}
      >
        Create Patient Account
      </Button>

      <div className="text-center pt-2 text-xs text-neutral-muted">
        Already have an account?{' '}
        <Link to="/signin" className="text-primary font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};

