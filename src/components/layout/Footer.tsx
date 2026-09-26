import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';
import { HeartPulse, Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-surface border-t border-neutral-border pt-12 pb-8 mt-auto text-neutral-text">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-neutral-border">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary font-heading font-bold text-2xl tracking-tight"
            >
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span>AARUNYA</span>
            </Link>
            <p className="text-sm text-neutral-muted max-w-sm leading-relaxed">
              Empowering international patients with transparent medical discovery, accredited hospital networks, expert second opinions, and dedicated travel support across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-muted">
              <Shield className="w-4 h-4 text-primary" />
              <span>NABH & JCI Accredited Hospital Partners</span>
            </div>
          </div>

          {/* Column 2: Healthcare */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-text uppercase tracking-wider mb-3">
              Medical Care
            </h4>
            <ul className="space-y-2 text-sm text-neutral-muted">
              <li>
                <Link to="/treatments" className="hover:text-primary transition-colors">
                  Treatments
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-primary transition-colors">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-primary transition-colors">
                  Leading Doctors
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-primary transition-colors">
                  Health Packages
                </Link>
              </li>
              <li>
                <Link to="/second-opinion" className="hover:text-primary transition-colors">
                  Second Medical Opinion
                </Link>
              </li>
              <li>
                <Link to="/video-consultation" className="hover:text-primary transition-colors">
                  Video Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Travel Assistance */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-text uppercase tracking-wider mb-3">
              Travel Assistance
            </h4>
            <ul className="space-y-2 text-sm text-neutral-muted">
              <li>
                <Link to="/travel" className="hover:text-primary transition-colors">
                  Travel Hub
                </Link>
              </li>
              <li>
                <Link to="/flights" className="hover:text-primary transition-colors flex items-center gap-1">
                  Flight Search <ExternalLink className="w-3 h-3 text-neutral-subtle" />
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-primary transition-colors flex items-center gap-1">
                  Hotels & Stay <ExternalLink className="w-3 h-3 text-neutral-subtle" />
                </Link>
              </li>
              <li>
                <Link to="/medical-visa" className="hover:text-primary transition-colors">
                  Medical Visa Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-text uppercase tracking-wider mb-3">
              About & Legal
            </h4>
            <ul className="space-y-2 text-sm text-neutral-muted">
              <li>
                <Link to="/how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/patient-stories" className="hover:text-primary transition-colors">
                  Patient Stories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/medical-disclaimer" className="hover:text-primary transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-subtle">
          <p className="max-w-3xl leading-relaxed">
            <strong className="text-neutral-muted">Medical Disclaimer:</strong> AARUNYA is a medical tourism facilitation and discovery platform. We do not provide direct medical advice, diagnosis, or treatment. All treatment estimates and medical information are subject to personalized clinical evaluation by certified physicians.
          </p>
          <div className="whitespace-nowrap text-right">
            &copy; {new Date().getFullYear()} AARUNYA. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

