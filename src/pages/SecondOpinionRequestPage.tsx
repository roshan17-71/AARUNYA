import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SecondOpinionRequestForm } from '../features/second-opinion/SecondOpinionRequestForm';
import {
  secondOpinionService,
  FALLBACK_SECOND_OPINION_SERVICES
} from '../services/secondOpinion.service';
import { SecondOpinionService } from '../types';
import { useAuth } from '../hooks/useAuth';

export const SecondOpinionRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tierSlug = searchParams.get('tier') || undefined;

  const { user, profile, loading: authLoading } = useAuth();
  const [services, setServices] = useState<SecondOpinionService[]>(FALLBACK_SECOND_OPINION_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const data = await secondOpinionService.getServices();
        setServices(data);
      } catch {
        setServices(FALLBACK_SECOND_OPINION_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-surface py-12">
        <Container className="text-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-neutral-muted">Loading Second Opinion Portal...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-surface py-10">
      <Container className="space-y-8">
        {/* Header Breadcrumb / Navigation */}
        <div className="flex items-center justify-between border-b border-neutral-border pb-4">
          <Link
            to="/second-opinion"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Opinion Tiers</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-neutral-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">256-bit Encrypted Healthcare Vault</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-2">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-neutral-text">
            Request a Second Medical Opinion
          </h1>
          <p className="text-xs text-neutral-muted">
            Submit your clinical history and diagnostic documents for specialist review.
          </p>
        </div>

        {/* Authentication Wall for Confidential Document Vault */}
        {!authLoading && (!user || profile?.role !== 'patient') ? (
          <Card className="max-w-xl mx-auto p-8 text-center border-neutral-border bg-white shadow-sm space-y-5">
            <div className="w-14 h-14 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-serif text-neutral-text">
                Patient Account Required
              </h2>
              <p className="text-xs text-neutral-muted mt-2 leading-relaxed">
                To safeguard confidential medical records and comply with clinical privacy regulations, requests and document uploads are linked to a verified patient portal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={`/signin?redirect=${encodeURIComponent(
                  `/second-opinion/request${tierSlug ? `?tier=${tierSlug}` : ''}`
                )}`}
                className="w-full sm:w-auto"
              >
                <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Continue</span>
                </Button>
              </Link>

              <Link
                to={`/signup/patient?redirect=${encodeURIComponent(
                  `/second-opinion/request${tierSlug ? `?tier=${tierSlug}` : ''}`
                )}`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Patient Account</span>
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Logged In Patient Request Form */
          <SecondOpinionRequestForm
            services={services}
            initialServiceSlug={tierSlug}
          />
        )}
      </Container>
    </div>
  );
};
