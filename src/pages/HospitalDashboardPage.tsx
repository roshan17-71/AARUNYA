import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Building2, Package, FileSpreadsheet, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HospitalDashboardPage = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning">Pending Review</Badge>
            <span className="text-xs text-neutral-muted">Hospital Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-text">
            {profile?.full_name || user?.email || 'Hospital Portal'}
          </h1>
          <p className="text-xs text-neutral-muted">
            Manage your hospital facility profile, health checkup packages, and inbound international quotes.
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
        <Building2 className="w-5 h-5 shrink-0 mt-0.5 text-status-warning" />
        <span className="text-neutral-text">
          <strong>Review Notice:</strong> Your hospital facility listing is awaiting administrative verification. Once approved by platform managers, your departments, accreditation badges, and packages will be searchable across the marketplace.
        </span>
      </div>

      {/* Metrics Shell */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Published Packages</p>
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
              <p className="text-xs text-neutral-muted">Inbound Quotes</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-info-bg flex items-center justify-center text-status-info">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Affiliated Doctors</p>
              <h3 className="text-xl font-bold text-neutral-text">0</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Profile Management (Phase 6)</CardTitle>
          <CardDescription>
            Full package creation, accreditation uploads, and department management will be enabled in Phase 6.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-neutral-bg border border-neutral-border rounded-card text-xs text-neutral-muted space-y-1">
            <p><strong>Contact Email:</strong> {user?.email}</p>
            <p><strong>Hospital Account ID:</strong> {user?.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

