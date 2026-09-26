import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plane, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navLinks = [
    { label: 'Treatments', href: '/treatments' },
    { label: 'Hospitals', href: '/hospitals' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Packages', href: '/packages' },
    { label: 'Video Consultation', href: '/video-consultation' },
    { label: 'Second Opinion', href: '/second-opinion' },
    { label: 'Patient Stories', href: '/patient-stories' },
  ];

  const travelLinks = [
    { label: 'Flights', href: '/flights' },
    { label: 'Hotels', href: '/hotels' },
    { label: 'Medical Visa Guide', href: '/medical-visa' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-text/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-neutral-surface shadow-dropdown p-6 flex flex-col justify-between overflow-y-auto z-10 border-l border-neutral-border">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2 text-primary font-heading font-bold text-xl tracking-tight"
            >
              <span>AARUNYA</span>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-muted hover:text-neutral-text transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-4">
            <p className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider mb-2">
              Medical Care
            </p>
            <nav className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-text hover:bg-neutral-bg hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="py-2 border-t border-neutral-border">
            <p className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider mb-2 pt-2 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-primary" />
              Travel Assistance
            </p>
            <nav className="flex flex-col space-y-1">
              {travelLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-md text-sm text-neutral-muted hover:text-neutral-text hover:bg-neutral-bg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-border flex flex-col gap-2">
          <Link to="/signin" onClick={onClose}>
            <Button variant="outline" className="w-full justify-center">
              Sign In
            </Button>
          </Link>
          <Link to="/signup/patient" onClick={onClose}>
            <Button variant="primary" className="w-full justify-center">
              Get Started
            </Button>
          </Link>
          <div className="pt-2 text-center text-xs text-neutral-subtle flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
            <span>Verified Healthcare Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};

