import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Calendar, FileSpreadsheet, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientDashboardPage = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary">Patient Portal</Badge>
            <span className="text-xs text-neutral-muted">Verified Session</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-text">
            Welcome, {profile?.full_name || user?.email || 'Patient'}
          </h1>
          <p className="text-xs text-neutral-muted">
            Manage your medical consultation requests, treatment quotes, and travel documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign Out
          </Button>
          <Link to="/">
            <Button variant="primary" size="sm">
              Explore Treatments
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Info strip */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-text">{profile?.full_name || 'Anonymous User'}</p>
              <p className="text-neutral-muted">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-neutral-muted">
            <div>
              <span className="font-medium text-neutral-text">Country:</span> {profile?.country || 'Not set'}
            </div>
            <div>
              <span className="font-medium text-neutral-text">Phone:</span>{' '}
              {profile?.phone_country_code} {profile?.phone_number || 'Not set'}
            </div>
            <Badge variant="success" size="sm">Active Account</Badge>
          </div>
        </div>
      </Card>

      {/* Metric Cards Shell */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Booked Consultations</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-hover">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Treatment Quotes</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-info-bg flex items-center justify-center text-status-info">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Second Opinion Cases</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your consultation history and case updates will appear here once booked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center text-xs text-neutral-muted border border-dashed border-neutral-border rounded-card">
            No active medical requests found. You can request a quote or video consultation from our public directory.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

