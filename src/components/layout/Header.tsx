import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, Plane, ShieldCheck, HeartPulse, User, LogOut } from 'lucide-react';
import { Container } from './Container';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isTravelOpen, setIsTravelOpen] = useState(false);
  const location = useLocation();
  const { user, profile, role, signOut } = useAuth();

  const getDashboardUrl = () => {
    switch (role) {
      case 'doctor':
        return '/dashboard/doctor';
      case 'hospital':
        return '/dashboard/hospital';
      case 'admin':
        return '/admin';
      case 'patient':
      default:
        return '/dashboard/patient';
    }
  };

  const navLinks = [
    { label: 'Treatments', href: '/treatments' },
    { label: 'Hospitals', href: '/hospitals' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Packages', href: '/packages' },
    { label: 'Video Consultation', href: '/video-consultation' },
    { label: 'Second Opinion', href: '/second-opinion' },
    { label: 'Patient Stories', href: '/patient-stories' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-neutral-surface/95 backdrop-blur-md border-b border-neutral-border">
        {/* Top utility bar */}
        <div className="bg-primary-light/50 border-b border-neutral-border text-[11px] text-neutral-muted py-1.5 hidden sm:block">
          <Container className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-primary font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Accredited NABH & JCI Hospital Network in India
              </span>
              <span>•</span>
              <span>24/7 International Patient Assistance</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dev/style-guide"
                className="hover:text-primary font-medium underline underline-offset-2"
              >
                Style Guide
              </Link>
            </div>
          </Container>
        </div>

        {/* Main Nav Bar */}
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2 text-primary font-heading font-bold text-2xl tracking-tight"
              >
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span>AARUNYA</span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navLinks.map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`px-3 py-1.5 text-xs font-medium rounded-button transition-colors ${
                        isActive
                          ? 'text-primary bg-primary-light font-semibold'
                          : 'text-neutral-text hover:text-primary hover:bg-neutral-bg'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Travel Assistance Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsTravelOpen(true)}
                  onMouseLeave={() => setIsTravelOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-text hover:text-primary hover:bg-neutral-bg rounded-button transition-colors"
                  >
                    <span>Travel</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {isTravelOpen && (
                    <div className="absolute top-full left-0 w-48 bg-neutral-surface border border-neutral-border rounded-card shadow-dropdown py-2 z-50">
                      <Link
                        to="/flights"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-text hover:bg-neutral-bg hover:text-primary"
                      >
                        <Plane className="w-3.5 h-3.5 text-primary" />
                        Flights (Redirect)
                      </Link>
                      <Link
                        to="/hotels"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-text hover:bg-neutral-bg hover:text-primary"
                      >
                        <span>Hotels Nearby</span>
                      </Link>
                      <Link
                        to="/medical-visa"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-text hover:bg-neutral-bg hover:text-primary"
                      >
                        <span>Medical Visa Guide</span>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to={getDashboardUrl()}>
                    <Button variant="secondary" size="sm">
                      <User className="w-3.5 h-3.5 mr-1" />
                      <span>{profile?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                      {role && (
                        <Badge variant="primary" size="sm" className="ml-1.5 capitalize text-[10px]">
                          {role}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4 text-neutral-muted hover:text-neutral-text" />
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup/patient">
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 rounded-md text-neutral-muted hover:text-neutral-text hover:bg-neutral-bg"
                aria-label="Open main menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};

