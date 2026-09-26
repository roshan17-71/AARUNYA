import { Container } from '../components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HospitalSignUpForm } from '../features/auth/HospitalSignUpForm';
import { Building2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SignUpHospitalPage = () => {
  return (
    <div className="py-12 bg-neutral-bg min-h-[calc(100vh-16rem)]">
      <Container size="sm">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/signin"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
          <Badge variant="info">Hospital Registration</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-status-info-bg flex items-center justify-center text-status-info">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Register Your Hospital Facility</CardTitle>
                <CardDescription>
                  Join India's premier international patient healthcare and medical tourism network.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <HospitalSignUpForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

