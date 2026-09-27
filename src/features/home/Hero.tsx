import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Container } from '../../components/layout/Container';
import { TreatmentSearchBar } from './TreatmentSearchBar';
import { ShieldCheck, Video, FileCheck2, Globe2 } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-primary-light/40 via-neutral-bg to-neutral-bg overflow-hidden border-b border-neutral-border">
      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Trust announcement badge */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="primary" size="md" className="gap-1.5 py-1 px-3">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Accredited NABH &amp; JCI Hospital Network across India</span>
            </Badge>
          </div>

          {/* Primary headline in Playfair Display */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-neutral-text tracking-tight leading-[1.15]">
            World-Class Medical Care in India,{' '}
            <span className="text-primary italic font-normal">Guided by Trust.</span>
          </h1>

          {/* Calming, professional subtitle */}
          <p className="text-base sm:text-lg text-neutral-muted max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified surgical specialists, get transparent procedure estimates, obtain comprehensive second medical opinions, and receive complete travel coordination.
          </p>

          {/* Main Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/treatments">
              <Button variant="primary" size="lg">
                Explore Treatments
              </Button>
            </Link>
            <Link to="/second-opinion">
              <Button variant="accent" size="lg">
                <FileCheck2 className="w-4 h-4 mr-1.5" />
                Request Second Opinion
              </Button>
            </Link>
            <Link to="/video-consultation">
              <Button variant="outline" size="lg">
                <Video className="w-4 h-4 mr-1.5 text-primary" />
                Book Video Consult
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="pt-6 sm:pt-8">
            <TreatmentSearchBar />
          </div>

          {/* Value highlight pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-neutral-muted">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Verified Doctor Credentials</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-primary" />
              <span>Dedicated International Patient Desks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span>60–80% Cost Advantage</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

