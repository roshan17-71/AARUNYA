import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Activity,
  Package,
  Video,
  FileCheck2,
  FileSpreadsheet,
  Headphones,
  BookOpen,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users (Patients)', href: '/admin/users', icon: Users },
    { label: 'Doctors & Queue', href: '/admin/doctors', icon: Stethoscope },
    { label: 'Hospitals & Queue', href: '/admin/hospitals', icon: Building2 },
    { label: 'Treatments', href: '/admin/treatments', icon: Activity },
    { label: 'Packages', href: '/admin/packages', icon: Package },
    { label: 'Consultations', href: '/admin/consultations', icon: Video },
    { label: 'Second Opinions', href: '/admin/second-opinions', icon: FileCheck2 },
    { label: 'Quote Requests', href: '/admin/quotes', icon: FileSpreadsheet },
    { label: 'Advisor Requests', href: '/admin/advisor-requests', icon: Headphones },
    { label: 'Patient Stories', href: '/admin/patient-stories', icon: BookOpen },
    { label: 'Visa Information', href: '/admin/visa-info', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col">
      {/* Admin Top Navbar */}
      <header className="h-16 bg-neutral-surface border-b border-neutral-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md text-neutral-muted hover:text-neutral-text lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link
            to="/admin"
            className="flex items-center gap-2 text-primary font-heading font-bold text-xl tracking-tight"
          >
            <div className="w-7 h-7 rounded-md bg-neutral-text flex items-center justify-center text-white">
              <ShieldAlert className="w-4 h-4 text-accent" />
            </div>
            <span>AARUNYA</span>
          </Link>
          <span className="text-neutral-border hidden sm:inline">|</span>
          <span className="text-xs text-neutral-muted font-medium hidden sm:inline">
            Platform Administration
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="warning" size="sm">
            Admin Console
          </Badge>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Exit to App
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Admin Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-20 w-64 bg-neutral-surface border-r border-neutral-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 flex flex-col justify-between h-full overflow-y-auto">
            <div>
              <p className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider mb-2 px-3">
                Operations
              </p>
              <nav className="space-y-1">
                {adminNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-button transition-colors ${
                        isActive
                          ? 'bg-primary text-white font-semibold shadow-subtle'
                          : 'text-neutral-text hover:bg-neutral-bg hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-inherit opacity-80" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-neutral-border text-[11px] text-neutral-subtle px-2">
              AARUNYA v0.1.0 • Admin Mode
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

