import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Stethoscope, Calendar, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboardPage = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning">Pending Review</Badge>
            <span className="text-xs text-neutral-muted">Physician Console</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-text">
            Welcome, Dr. {profile?.full_name || user?.email || 'Doctor'}
          </h1>
          <p className="text-xs text-neutral-muted">
            Configure your video consultation calendar, view patient cases, and set consultation fees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign Out
          </Button>
          <Link to="/dev/style-guide">
            <Button variant="primary" size="sm">
              Style Guide
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 bg-status-warning-bg/70 border border-status-warning/30 rounded-card text-xs text-status-warning flex items-start gap-2">
        <Stethoscope className="w-5 h-5 shrink-0 mt-0.5 text-status-warning" />
        <span className="text-neutral-text">
          <strong>Account Status: Pending Administrative Approval.</strong> Your doctor profile has been created in the database and is currently under review by AARUNYA clinical verifiers. You can manage your dashboard while awaiting approval.
        </span>
      </div>

      {/* Metrics Shell */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Upcoming Consultations</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-hover">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Open Time Slots</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-info-bg flex items-center justify-center text-status-info">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Consultation Fee</p>
              <h3 className="text-xl font-bold text-neutral-text">Not Set</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Profile &amp; Settings (Phase 7)</CardTitle>
          <CardDescription>
            Full profile customization, qualification uploads, and slot scheduler will be wired in Phase 7.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-neutral-bg border border-neutral-border rounded-card text-xs text-neutral-muted space-y-1">
            <p><strong>Registered Email:</strong> {user?.email}</p>
            <p><strong>Doctor ID (UID):</strong> {user?.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

