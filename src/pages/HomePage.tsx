import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Treatment, Hospital, Doctor, PatientStory } from '../types';
import { Container } from '../components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FAQAccordion } from '../components/ui/FAQAccordion';
import { Hero } from '../features/home/Hero';
import { StatBand } from '../features/home/StatBand';
import { CTASection } from '../features/home/CTASection';
import {
  HeartPulse,
  Building2,
  Stethoscope,
  Plane,
  Video,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Quote,
  Sparkles,
} from 'lucide-react';

export const HomePage = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stories, setStories] = useState<PatientStory[]>([]);
  const [, setLoading] = useState(true);

  // Fetch initial preview data from Supabase, with graceful fallbacks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [treatmentsRes, hospitalsRes, doctorsRes, storiesRes] = await Promise.allSettled([
          supabase.from('treatments').select('*').limit(6),
          supabase.from('hospitals').select('*').eq('status', 'approved').limit(3),
          supabase.from('doctors').select('*').eq('status', 'approved').limit(4),
          supabase.from('patient_stories').select('*').limit(3),
        ]);

        if (treatmentsRes.status === 'fulfilled' && treatmentsRes.value.data) {
          setTreatments(treatmentsRes.value.data as Treatment[]);
        }
        if (hospitalsRes.status === 'fulfilled' && hospitalsRes.value.data) {
          setHospitals(hospitalsRes.value.data as Hospital[]);
        }
        if (doctorsRes.status === 'fulfilled' && doctorsRes.value.data) {
          setDoctors(doctorsRes.value.data as Doctor[]);
        }
        if (storiesRes.status === 'fulfilled' && storiesRes.value.data) {
          setStories(storiesRes.value.data as PatientStory[]);
        }
      } catch (err) {
        console.warn('[HomePage] Data fetch note:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Curated fallback data for Phase 4 display before database seeding (Phases 5-7)
  const defaultTreatments = [
    {
      id: 't-1',
      name: 'Coronary Artery Bypass Graft (CABG)',
      slug: 'coronary-artery-bypass',
      specialty: 'Cardiology',
      category: 'Heart Surgery',
      overview: 'Minimally invasive bypass procedures utilizing advanced beating-heart technology.',
      estimated_duration: '7–10 days in India',
    },
    {
      id: 't-2',
      name: 'Total Knee Replacement (Robotic)',
      slug: 'robotic-knee-replacement',
      specialty: 'Orthopedics',
      category: 'Joint Care',
      overview: 'Computer-guided precision knee arthroplasty with sub-millimeter surgical accuracy.',
      estimated_duration: '5–7 days in India',
    },
    {
      id: 't-3',
      name: 'CyberKnife Radiation Oncology',
      slug: 'cyberknife-radiosurgery',
      specialty: 'Oncology',
      category: 'Cancer Therapy',
      overview: 'Non-invasive robotic radiation treatment for complex inoperable tumors.',
      estimated_duration: '3–5 days in India',
    },
    {
      id: 't-4',
      name: 'Living Donor Liver Transplant',
      slug: 'liver-transplant',
      specialty: 'Transplantation',
      category: 'Organ Transplant',
      overview: 'Renowned transplant units with 95%+ success rates and full post-operative monitoring.',
      estimated_duration: '3–4 weeks in India',
    },
    {
      id: 't-5',
      name: 'Deep Brain Stimulation (DBS)',
      slug: 'deep-brain-stimulation',
      specialty: 'Neurology',
      category: 'Neurosurgery',
      overview: 'Advanced neuro-stimulation therapy for Parkinson’s and movement disorders.',
      estimated_duration: '10–14 days in India',
    },
    {
      id: 't-6',
      name: 'IVF & Fertility Treatment',
      slug: 'ivf-fertility-treatment',
      specialty: 'Reproductive Medicine',
      category: 'Fertility',
      overview: 'High-success assisted reproductive technologies with genetic screening protocols.',
      estimated_duration: '15–20 days in India',
    },
  ];

  const defaultHospitals = [
    {
      id: 'h-1',
      name: 'Medanta — The Medicity',
      slug: 'medanta-the-medicity-gurugram',
      city: 'Gurugram, Delhi NCR',
      accreditations: ['JCI', 'NABH'],
      specialties: ['Cardiac Care', 'Neurosciences', 'Organ Transplant'],
      description: '1,250-bed multi-super-specialty institute founded by world-renowned surgeons.',
    },
    {
      id: 'h-2',
      name: 'Apollo Hospitals International',
      slug: 'apollo-hospitals-chennai',
      city: 'Chennai',
      accreditations: ['JCI', 'NABH'],
      specialties: ['Oncology', 'Orthopedics', 'Robotic Surgery'],
      description: 'Pioneered modern private healthcare in India with dedicated international patient wings.',
    },
    {
      id: 'h-3',
      name: 'Fortis Memorial Research Institute',
      slug: 'fortis-memorial-research-institute',
      city: 'Gurugram, Delhi NCR',
      accreditations: ['JCI', 'NABH'],
      specialties: ['Bone Marrow Transplant', 'Cardiac Sciences', 'Pediatrics'],
      description: 'Quaternary care hospital recognized globally for advanced clinical technology.',
    },
  ];

  const defaultDoctors = [
    {
      id: 'd-1',
      full_name: 'Dr. Naresh Trehan',
      specialty: 'Cardiovascular Surgery',
      experience_years: 40,
      qualifications: 'MBBS, Diplomat ABS, FACS',
      city: 'Gurugram, Delhi NCR',
      fee: '$80 Est.',
    },
    {
      id: 'd-2',
      full_name: 'Dr. Ashok Rajgopal',
      specialty: 'Orthopedics & Joint Replacement',
      experience_years: 35,
      qualifications: 'MS (Ortho), MCh, FRCS',
      city: 'New Delhi',
      fee: '$75 Est.',
    },
    {
      id: 'd-3',
      full_name: 'Dr. Vinod Raina',
      specialty: 'Medical Oncology & Hematology',
      experience_years: 32,
      qualifications: 'MD (Med), DM (Oncology), FRCP',
      city: 'Gurugram',
      fee: '$85 Est.',
    },
    {
      id: 'd-4',
      full_name: 'Dr. Rana Patir',
      specialty: 'Neurosurgery & Spine Surgery',
      experience_years: 28,
      qualifications: 'MS (Gen Surg), MCh (Neurosurg)',
      city: 'New Delhi',
      fee: '$70 Est.',
    },
  ];

  const defaultStories = [
    {
      id: 's-1',
      display_name: 'Ahmed & Family',
      country: 'Oman',
      treatment: 'Cardiac Valve Repair',
      hospital: 'Apollo Hospitals, New Delhi',
      story: 'We were nervous about traveling abroad for heart surgery, but AARUNYA coordinated our medical visa within 48 hours and arranged an Arabic interpreter who was by our side throughout admission.',
    },
    {
      id: 's-2',
      display_name: 'Elena K.',
      country: 'Kazakhstan',
      treatment: 'Bilateral Knee Replacement',
      hospital: 'Medanta, Gurugram',
      story: 'The robotic knee surgery gave me my mobility back. I paid less than 25% of what was quoted in Europe, and the nursing staff treated me like family.',
    },
    {
      id: 's-3',
      display_name: 'David M.',
      country: 'Kenya',
      treatment: 'Oncology Second Opinion',
      hospital: 'Fortis Memorial',
      story: 'Getting a written second opinion before traveling confirmed our local diagnosis and gave us confidence in the treatment protocol. Truly transparent care.',
    },
  ];

  const faqItems = [
    {
      question: 'Why choose India for international medical treatment?',
      answer: 'India features over 40 JCI-accredited and 1,000+ NABH-accredited tertiary hospitals offering cutting-edge medical technology (da Vinci robotic surgery, CyberKnife, Proton beam therapy) with English-speaking clinicians and 60%–80% cost savings compared to the US, UK, and Western Europe.',
    },
    {
      question: 'How do I obtain an Indian Medical Visa (e-Medical Visa)?',
      answer: 'After you select a hospital and obtain a formal Medical Visa Invitation Letter (facilitated by AARUNYA), you can apply online through the official Indian government e-Visa portal. Medical visas are typically issued within 72 to 96 hours and allow companion attendants.',
    },
    {
      question: 'How does AARUNYA protect my confidential medical records?',
      answer: 'All uploaded medical scans, lab reports, and clinical summaries are stored in private, encrypted cloud storage buckets governed by strict Row-Level Security policies. Records are only accessible by you, platform administrators, and physicians specifically assigned to your case.',
    },
    {
      question: 'How are treatment estimates and doctor fees calculated?',
      answer: 'All treatment fees and package costs shown are indicative estimates based on typical hospital lengths of stay and standard clinical consumables. Every patient receives a personalized, formal quote after certified physicians review their specific medical scans.',
    },
    {
      question: 'Will there be a language barrier during my hospital stay?',
      answer: 'No. English is the primary language of clinical practice in all accredited Indian hospitals. Additionally, our partner hospitals provide dedicated international desks with native interpreters for Arabic, Russian, French, and other languages.',
    },
  ];

  const displayTreatments = treatments.length > 0 ? treatments : defaultTreatments;
  const displayHospitals = hospitals.length > 0 ? hospitals : defaultHospitals;
  const displayDoctors = doctors.length > 0 ? doctors : defaultDoctors;
  const displayStories = stories.length > 0 ? stories : defaultStories;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Popular Treatments Section */}
      <section>
        <Container>
          <SectionHeading
            badge="Clinical Specialties"
            title="Popular Treatments & Procedures"
            subtitle="Explore accredited medical treatments performed by board-certified department heads."
            align="left"
            action={
              <Link to="/treatments">
                <Button variant="outline" size="sm">
                  View All Treatments
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTreatments.map((t) => (
              <Card key={t.id} hoverEffect className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary" size="sm">{t.specialty}</Badge>
                    <span className="text-[11px] text-neutral-muted">{t.category}</span>
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {t.overview || 'Comprehensive surgical protocol adhering to international clinical standards.'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-3">
                  <span className="text-xs text-neutral-muted">
                    {t.estimated_duration || '3–7 days est.'}
                  </span>
                  <Link to={`/treatments?specialty=${encodeURIComponent(t.specialty)}`}>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Featured Hospitals Section */}
      <section className="bg-neutral-surface/60 py-16 border-y border-neutral-border">
        <Container>
          <SectionHeading
            badge="Accredited Centers"
            title="Featured Hospitals & Medical Institutes"
            subtitle="Partnering with NABH and JCI accredited facilities equipped with modern robotic and quaternary surgical suites."
            align="left"
            action={
              <Link to="/hospitals">
                <Button variant="outline" size="sm">
                  Browse All Hospitals
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayHospitals.map((h) => (
              <Card key={h.id} hoverEffect className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5">
                      {h.accreditations?.map((acc: string) => (
                        <Badge key={acc} variant="info" size="sm">{acc}</Badge>
                      ))}
                    </div>
                    <span className="text-xs text-neutral-muted">{h.city}</span>
                  </div>
                  <CardTitle className="text-lg">{h.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {h.description || 'Premier quaternary care institute offering multi-disciplinary patient care.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {h.specialties?.slice(0, 3).map((spec: string) => (
                      <span key={spec} className="text-[11px] bg-neutral-bg px-2 py-0.5 rounded border border-neutral-border text-neutral-muted">
                        {spec}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-status-success font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Facility
                  </span>
                  <Link to="/hospitals">
                    <Button variant="outline" size="sm">
                      View Center
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Leading Doctors Section */}
      <section>
        <Container>
          <SectionHeading
            badge="Clinical Leadership"
            title="Consult with Leading Specialists"
            subtitle="Schedule video consultations or obtain second medical opinions directly from veteran clinicians."
            align="left"
            action={
              <Link to="/doctors">
                <Button variant="outline" size="sm">
                  View All Doctors
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayDoctors.map((d) => (
              <Card key={d.id} hoverEffect className="flex flex-col justify-between">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold mb-3">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-base">{d.full_name}</CardTitle>
                  <CardDescription className="text-xs text-primary font-medium mt-0.5">
                    {d.specialty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5 text-xs text-neutral-muted">
                  <p><strong>Experience:</strong> {d.experience_years}+ Years</p>
                  <p className="line-clamp-1"><strong>Degrees:</strong> {d.qualifications}</p>
                  <p><strong>Location:</strong> {d.city}</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs font-semibold text-neutral-text">
                    {'fee' in d ? (d as { fee: string }).fee : '$75 Est.'}
                  </span>
                  <Link to="/video-consultation">
                    <Button variant="primary" size="sm">
                      Book Consult
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Why India Section */}
      <section className="bg-neutral-surface py-16 border-y border-neutral-border">
        <Container>
          <SectionHeading
            badge="Destination Advantage"
            title="Why International Patients Choose India"
            subtitle="Combining advanced clinical innovation, renowned medical faculties, and transparent patient care."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-card border border-neutral-border bg-neutral-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-md bg-primary-light flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-text">Accredited Quality</h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                40+ JCI-accredited and 1,000+ NABH hospitals adhering to strict international patient safety and clinical protocols.
              </p>
            </div>

            <div className="p-6 rounded-card border border-neutral-border bg-neutral-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-md bg-accent-light flex items-center justify-center text-accent-hover">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-text">Cutting-Edge Tech</h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Equipped with fourth-generation da Vinci surgical robots, CyberKnife, Proton beam cancer therapy, and 3T MRI imaging.
              </p>
            </div>

            <div className="p-6 rounded-card border border-neutral-border bg-neutral-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-md bg-status-success-bg flex items-center justify-center text-status-success">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-text">60%–80% Cost Savings</h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                High-quality clinical interventions at a fraction of Western costs, without waiting lists or hidden facility surcharges.
              </p>
            </div>

            <div className="p-6 rounded-card border border-neutral-border bg-neutral-bg/50 space-y-3">
              <div className="w-10 h-10 rounded-md bg-status-info-bg flex items-center justify-center text-status-info">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-text">English &amp; Interpreters</h3>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Entire medical faculties speak fluent English. Dedicated multi-lingual translators support Arabic, French, and Russian patients.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. How It Works (4 Steps) */}
      <section>
        <Container>
          <SectionHeading
            badge="Simple 4-Step Process"
            title="How Your Journey Works"
            subtitle="Transparent, guided facilitation from your initial inquiry to your safe recovery back home."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="p-6 rounded-card border border-neutral-border bg-neutral-surface relative text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="text-base font-semibold text-neutral-text mb-2">Discover &amp; Compare</h4>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Search verified treatments, compare accredited hospitals in India, and view leading physician credentials.
              </p>
            </div>

            <div className="p-6 rounded-card border border-neutral-border bg-neutral-surface relative text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="text-base font-semibold text-neutral-text mb-2">Second Opinion &amp; Quote</h4>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Upload existing medical scans for expert clinical case review and receive a clear, itemized cost estimate.
              </p>
            </div>

            <div className="p-6 rounded-card border border-neutral-border bg-neutral-surface relative text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="text-base font-semibold text-neutral-text mb-2">Visa &amp; Travel Planning</h4>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Receive official Medical Visa invitation letters, airport pick-up coordination, and nearby hotel assistance.
              </p>
            </div>

            <div className="p-6 rounded-card border border-neutral-border bg-neutral-surface relative text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h4 className="text-base font-semibold text-neutral-text mb-2">Treatment &amp; Healing</h4>
              <p className="text-xs text-neutral-muted leading-relaxed">
                Admit to your chosen hospital, undergo treatment with personal coordinators, and enjoy guided post-op recovery.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/how-it-works">
              <Button variant="outline" size="sm">
                <span>Read Full Step-by-Step Patient Guide</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 7 & 8. Dual Action Bands: Second Opinion & Video Consultation */}
      <section className="bg-neutral-surface/60 py-12 border-y border-neutral-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Second Opinion Band */}
            <div className="p-8 rounded-card bg-primary-light/60 border border-primary/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <Badge variant="primary" size="sm" className="mb-2">Confirmatory Review</Badge>
                <h3 className="text-xl font-heading font-bold text-neutral-text mb-2">
                  Need a Certified Second Medical Opinion?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed mb-6">
                  Before making major surgery decisions, have board-certified Indian specialists review your diagnostics, MRI scans, and histopathology reports.
                </p>
              </div>
              <Link to="/second-opinion">
                <Button variant="primary" size="md">
                  <span>Explore 4 Opinion Tiers</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>

            {/* Video Consultation Band */}
            <div className="p-8 rounded-card bg-accent-light/60 border border-accent/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-accent text-white flex items-center justify-center mb-4">
                  <Video className="w-5 h-5" />
                </div>
                <Badge variant="secondary" size="sm" className="mb-2">Teleconsultation</Badge>
                <h3 className="text-xl font-heading font-bold text-neutral-text mb-2">
                  Speak with a Specialist from Home
                </h3>
                <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed mb-6">
                  Discuss treatment options and travel readiness directly with India’s leading department heads via private, scheduled video consultations.
                </p>
              </div>
              <Link to="/video-consultation">
                <Button variant="accent" size="md">
                  <span>Book Video Appointment</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 9 & 10. Packages & Travel Hub Previews */}
      <section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Health Packages Preview */}
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-status-info-bg flex items-center justify-center text-status-info">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-text">Health Screening Packages</h3>
                  <p className="text-xs text-neutral-muted">Comprehensive full-body &amp; cardiac checkups</p>
                </div>
              </div>
              <p className="text-xs text-neutral-muted leading-relaxed mb-4">
                Hospital-curated packages bundling blood investigations, CT calcium scoring, 2D Echo, endoscopy, and consultant reviews at pre-negotiated package rates.
              </p>
              <div className="pt-2">
                <Link to="/packages">
                  <Button variant="outline" size="sm">
                    <span>Browse Health Packages</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Travel Assistance Hub Preview */}
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-primary-light flex items-center justify-center text-primary">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-text">Travel &amp; Visa Assistance</h3>
                  <p className="text-xs text-neutral-muted">Flights redirect, hotels &amp; medical e-Visa</p>
                </div>
              </div>
              <p className="text-xs text-neutral-muted leading-relaxed mb-4">
                International patients receive official hospital visa invitation letters, trusted flight search redirects, and curated accommodations near hospital campuses.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link to="/medical-visa">
                  <Button variant="outline" size="sm">
                    Medical Visa Info
                  </Button>
                </Link>
                <Link to="/travel">
                  <Button variant="primary" size="sm">
                    Open Travel Hub
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 11. Patient Stories & Testimonials Strip */}
      <section className="bg-neutral-surface py-16 border-y border-neutral-border">
        <Container>
          <SectionHeading
            badge="Real Journeys"
            title="Voices of Our International Patients"
            subtitle="Verified accounts of recovery and healing from patients who traveled to India."
            align="left"
            action={
              <Link to="/patient-stories">
                <Button variant="outline" size="sm">
                  All Patient Stories
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayStories.map((s) => (
              <Card key={s.id} className="p-6 flex flex-col justify-between bg-neutral-bg/40">
                <div className="space-y-3">
                  <Quote className="w-7 h-7 text-primary/30" />
                  <p className="text-xs sm:text-sm text-neutral-text italic leading-relaxed">
                    "{(s as { story?: string }).story || ''}"
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-neutral-border flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-neutral-text">{s.display_name}</h5>
                    <p className="text-neutral-muted">{s.country}</p>
                  </div>
                  <Badge variant="success" size="sm">Verified Patient</Badge>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 12. Trust & Accreditation Stats Strip */}
      <StatBand />

      {/* 13. FAQ Accordion */}
      <section>
        <Container>
          <SectionHeading
            badge="Frequently Asked Questions"
            title="Everything You Need to Know"
            subtitle="Clear answers about traveling to India for medical procedures, visas, and costs."
          />

          <FAQAccordion items={faqItems} />
        </Container>
      </section>

      {/* 14. Final CTA Banner */}
      <CTASection />
    </div>
  );
};
