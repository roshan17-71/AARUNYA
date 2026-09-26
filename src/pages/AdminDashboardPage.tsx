import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Stethoscope, Building2, Users, FileSpreadsheet } from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning">Administrator</Badge>
            <span className="text-xs text-neutral-muted">Platform Control Center</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-text">
            Admin Overview: {profile?.full_name || user?.email || 'Platform Admin'}
          </h1>
          <p className="text-xs text-neutral-muted">
            Manage provider approval queues, treatment content, and international patient requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="p-4 bg-primary-light border border-primary/20 rounded-card text-xs text-primary flex items-start gap-2">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <span className="text-neutral-text">
          <strong>Admin Privileges Verified:</strong> You are authenticated with <code className="font-semibold text-primary">role = 'admin'</code>. Full administrative actions and operational queues will be expanded in Phase 14.
        </span>
      </div>

      {/* Metrics Shell */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-warning-bg flex items-center justify-center text-status-warning">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Doctors Awaiting Review</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-info-bg flex items-center justify-center text-status-info">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Hospitals Awaiting Review</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Inbound Quotes</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent-hover">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Registered Patients</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrative Operations (Phase 14)</CardTitle>
          <CardDescription>
            Approval queues, treatment publishing, and request assigners will be wired in Phase 14.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-neutral-bg border border-neutral-border rounded-card text-xs text-neutral-muted space-y-1">
            <p><strong>Admin Email:</strong> {user?.email}</p>
            <p><strong>Admin UUID:</strong> {user?.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

