import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Users, Stethoscope, Building2, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPreviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning">Admin Layout Shell</Badge>
            <span className="text-xs text-neutral-muted">Platform Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-text">Operational Overview</h1>
          <p className="text-xs text-neutral-muted">
            Manage provider listings, verification queues, and international case requests.
          </p>
        </div>

        <Link to="/dev/style-guide">
          <Button variant="outline" size="sm">
            Back to Style Guide
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-warning-bg flex items-center justify-center text-status-warning">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Pending Doctors</p>
              <h3 className="text-xl font-bold text-neutral-text">3 In Queue</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-status-info-bg flex items-center justify-center text-status-info">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">Pending Hospitals</p>
              <h3 className="text-xl font-bold text-neutral-text">1 In Queue</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-muted">New Quote Requests</p>
              <h3 className="text-xl font-bold text-neutral-text">7 Today</h3>
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
              <h3 className="text-xl font-bold text-neutral-text">148 Total</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Verification Queue Preview</CardTitle>
          <CardDescription>
            Doctors and hospitals registered through self-signup pending administrative vetting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-bg border-b border-neutral-border text-neutral-muted uppercase">
                <tr>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Specialty / Facility</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                <tr>
                  <td className="p-3 font-medium text-neutral-text">Dr. Arvind Sharma</td>
                  <td className="p-3 text-neutral-muted">Pediatric Oncology</td>
                  <td className="p-3 text-neutral-muted">Mumbai, India</td>
                  <td className="p-3">
                    <Badge variant="warning" size="sm">Pending Review</Badge>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Button variant="primary" size="sm">Approve</Button>
                    <Button variant="outline" size="sm">Reject</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

