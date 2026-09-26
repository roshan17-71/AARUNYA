import { Container } from '../components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DoctorSignUpForm } from '../features/auth/DoctorSignUpForm';
import { Stethoscope, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SignUpDoctorPage = () => {
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
          <Badge variant="secondary">Doctor Registration</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-hover">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Register as a Healthcare Specialist</CardTitle>
                <CardDescription>
                  Receive international second-opinion inquiries and video consultation appointments.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DoctorSignUpForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

