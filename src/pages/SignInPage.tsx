import { Container } from '../components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { LoginForm } from '../features/auth/LoginForm';
import { RoleSelector } from '../features/auth/RoleSelector';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SignInPage = () => {
  return (
    <div className="py-12 sm:py-16 bg-neutral-bg min-h-[calc(100vh-16rem)]">
      <Container size="sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary font-heading font-bold text-2xl tracking-tight mb-2"
          >
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span>AARUNYA</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">
            Sign In to Your Account
          </h1>
          <p className="text-xs sm:text-sm text-neutral-muted mt-1">
            Access your consultations, treatment quotes, or healthcare dashboard.
          </p>
        </div>

        {/* Login Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your registered email address and password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* New Account Role Selector Section */}
        <div className="mt-10 pt-8 border-t border-neutral-border">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold text-neutral-muted uppercase tracking-wider">
              Don't have an account yet?
            </span>
            <h3 className="text-lg font-bold text-neutral-text mt-1">
              Choose Your Account Type to Register
            </h3>
            <p className="text-xs text-neutral-muted mt-0.5">
              Select who you are to open the appropriate registration form.
            </p>
          </div>

          <RoleSelector />

          <div className="mt-8 text-center text-xs text-neutral-subtle flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-status-success" />
            <span>Encrypted patient authentication powered by Supabase Auth</span>
          </div>
        </div>
      </Container>
    </div>
  );
};

