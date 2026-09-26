import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  User,
  Calendar,
  FileText,
  FileSpreadsheet,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export interface DashboardLayoutProps {
  role?: 'patient' | 'doctor' | 'hospital';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role = 'patient' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const roleNavItems = {
    patient: [
      { label: 'Overview', href: '/dashboard/patient', icon: User },
      { label: 'My Bookings', href: '/dashboard/patient#bookings', icon: Calendar },
      { label: 'Treatment Quotes', href: '/dashboard/patient#quotes', icon: FileSpreadsheet },
      { label: 'Second Opinions', href: '/dashboard/patient#second-opinions', icon: FileText },
      { label: 'Documents', href: '/dashboard/patient#documents', icon: FileText },
      { label: 'Profile Settings', href: '/profile', icon: Settings },
    ],
    doctor: [
      { label: 'Doctor Overview', href: '/dashboard/doctor', icon: User },
      { label: 'Consultations', href: '/dashboard/doctor#consultations', icon: Calendar },
      { label: 'Availability Slots', href: '/dashboard/doctor#slots', icon: Calendar },
      { label: 'Profile & Rates', href: '/dashboard/doctor#profile', icon: Settings },
    ],
    hospital: [
      { label: 'Hospital Overview', href: '/dashboard/hospital', icon: User },
      { label: 'Manage Packages', href: '/dashboard/hospital#packages', icon: FileSpreadsheet },
      { label: 'Hospital Profile', href: '/dashboard/hospital#profile', icon: Settings },
    ],
  };

  const navItems = roleNavItems[role] || roleNavItems.patient;

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col">
      {/* Top Navbar */}
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
            to="/"
            className="flex items-center gap-2 text-primary font-heading font-bold text-xl tracking-tight"
          >
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span>AARUNYA</span>
          </Link>
          <span className="text-neutral-border hidden sm:inline">|</span>
          <span className="text-xs text-neutral-muted font-medium capitalize hidden sm:inline">
            {role} Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="sm" className="capitalize">
            {role}
          </Badge>
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-medium text-xs">
            U
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Exit
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-20 w-64 bg-neutral-surface border-r border-neutral-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <p className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider mb-2 px-3">
                Navigation
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-button transition-colors ${
                        isActive
                          ? 'bg-primary-light text-primary font-semibold'
                          : 'text-neutral-text hover:bg-neutral-bg hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-neutral-muted" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-subtle opacity-70" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-3 bg-neutral-bg rounded-card border border-neutral-border text-xs text-neutral-muted">
              <p className="font-semibold text-neutral-text">Need Assistance?</p>
              <p className="mt-1 text-[11px]">Contact international patient coordinators anytime.</p>
            </div>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

