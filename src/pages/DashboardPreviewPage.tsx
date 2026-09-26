import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Calendar, FileSpreadsheet, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPreviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary">Phase 1 Layout Shell</Badge>
            <span className="text-xs text-neutral-muted">Patient Portal Mock</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-text">Welcome back, John Doe</h1>
          <p className="text-xs text-neutral-muted">
            Track your medical inquiries, consultations, and travel coordination.
          </p>
        </div>

        <Link to="/dev/style-guide">
          <Button variant="outline" size="sm">
            Back to Style Guide
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Upcoming Consultations</p>
              <h3 className="text-xl font-bold text-neutral-text">1 Scheduled</h3>
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
              <h3 className="text-xl font-bold text-neutral-text">2 Active</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-info-bg flex items-center justify-center text-status-info">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Uploaded Scans</p>
              <h3 className="text-xl font-bold text-neutral-text">4 Files</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Case Activity</CardTitle>
          <CardDescription>
            Real-time status updates from hospital coordinators and attending physicians
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-neutral-bg rounded-card border border-neutral-border text-xs text-neutral-muted flex items-center justify-between">
            <span>Cardiology Second Opinion Case #SO-8829 is currently under clinical review.</span>
            <Badge variant="warning" size="sm">Under Review</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

