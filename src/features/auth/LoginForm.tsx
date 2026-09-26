import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertCircle, Lock } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const { error, role } = await signIn(email.trim(), password);

    if (error) {
      setFormError(error.message || 'Invalid email or password.');
      setIsSubmitting(false);
      return;
    }

    // Role-based redirection per §4.1
    const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;
    if (fromPath && !fromPath.startsWith('/signin') && !fromPath.startsWith('/signup')) {
      navigate(fromPath, { replace: true });
      return;
    }

    switch (role) {
      case 'doctor':
        navigate('/dashboard/doctor', { replace: true });
        break;
      case 'hospital':
        navigate('/dashboard/hospital', { replace: true });
        break;
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      case 'patient':
      default:
        navigate('/dashboard/patient', { replace: true });
        break;
    }
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
        label="Email Address"
        type="email"
        required
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center"
        isLoading={isSubmitting}
      >
        <Lock className="w-4 h-4 mr-1" />
        Sign In
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-neutral-muted">
          Need assistance or forgot password?{' '}
          <span className="text-primary cursor-pointer hover:underline">
            Contact Support
          </span>
        </p>
      </div>
    </form>
  );
};
