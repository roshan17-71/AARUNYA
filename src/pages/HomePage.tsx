import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, ShieldCheck, Stethoscope, Building2, Plane } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Hero Section Shell */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge variant="primary" size="md">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Phase 1 Scaffold &amp; Design System Active
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-neutral-text tracking-tight leading-tight">
            World-Class Medical Care in India, Simplified.
          </h1>

          <p className="text-base sm:text-lg text-neutral-muted leading-relaxed">
            Welcome to <strong className="text-primary font-semibold">AARUNYA</strong>. Empowering international patients with verified hospital discovery, transparent quotes, leading doctor consultations, and complete medical travel assistance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/dev/style-guide">
              <Button variant="primary" size="lg">
                Explore Style Guide
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/preview/dashboard">
              <Button variant="outline" size="lg">
                Preview Dashboard Shell
              </Button>
            </Link>
            <Link to="/preview/admin">
              <Button variant="ghost" size="lg">
                Preview Admin Shell
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <Card hoverEffect>
            <CardHeader>
              <div className="w-10 h-10 rounded-md bg-primary-light flex items-center justify-center text-primary mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <CardTitle>Accredited Hospitals</CardTitle>
              <CardDescription>NABH &amp; JCI Quality Standards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Connect with India's premier multi-specialty centers equipped with advanced robotic and cardiac surgical suites.
              </p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardHeader>
              <div className="w-10 h-10 rounded-md bg-accent-light flex items-center justify-center text-accent-hover mb-2">
                <Stethoscope className="w-5 h-5" />
              </div>
              <CardTitle>Leading Specialists</CardTitle>
              <CardDescription>Second Opinions &amp; Teleconsults</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Schedule video consultations with board-certified department heads and obtain comprehensive case evaluations.
              </p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardHeader>
              <div className="w-10 h-10 rounded-md bg-status-info-bg flex items-center justify-center text-status-info mb-2">
                <Plane className="w-5 h-5" />
              </div>
              <CardTitle>Travel &amp; Visa Care</CardTitle>
              <CardDescription>End-to-End Guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Dedicated assistance with medical visa invitation letters, airport transfers, local accommodations, and language interpreters.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

