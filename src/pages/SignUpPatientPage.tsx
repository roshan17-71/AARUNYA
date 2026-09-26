import { Container } from '../components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PatientSignUpForm } from '../features/auth/PatientSignUpForm';
import { User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SignUpPatientPage = () => {
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
          <Badge variant="primary">Patient Registration</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Create Your Patient Account</CardTitle>
                <CardDescription>
                  Access top hospital estimates, second opinions, and medical visa support.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PatientSignUpForm />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

