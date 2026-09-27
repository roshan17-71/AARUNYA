import { Link } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { HeartPulse, ArrowRight, Headphones, FileText } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-16 md:py-20 bg-primary text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-accent mb-2">
            <HeartPulse className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight leading-tight">
            Take the First Step Towards World-Class Healing
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Our international patient coordinators assist you at every step — from translating medical reports and hospital matching to medical visa invitations and local accommodation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/treatments">
              <Button variant="accent" size="lg" className="shadow-dropdown">
                <FileText className="w-4 h-4 mr-2" />
                <span>Get Treatment Quote</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              >
                <Headphones className="w-4 h-4 mr-2" />
                <span>Talk to a Medical Advisor</span>
              </Button>
            </Link>
          </div>

          <p className="text-xs text-white/60 pt-2">
            Free case evaluation • No commitment • HIPAA-aligned medical privacy
          </p>
        </div>
      </Container>
    </section>
  );
};

