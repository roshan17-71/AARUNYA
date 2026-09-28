import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Doctor, Hospital, ConsultationSlot, Consultation } from '../types';
import {
  consultationsService,
  SpecialtyWithCount,
} from '../services/consultations.service';
import { doctorsService } from '../services/doctors.service';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SpecialtyPicker } from '../features/consultations/SpecialtyPicker';
import { DoctorPicker } from '../features/consultations/DoctorPicker';
import { SlotPicker } from '../features/consultations/SlotPicker';
import { ConsultationRequestForm } from '../features/consultations/ConsultationRequestForm';
import {
  Video,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  FileText,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const VideoConsultationPage = () => {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();

  // Wizard Step (1: Specialty, 2: Doctor, 3: Slot, 4: Details, 5: Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const [doctors, setDoctors] = useState<(Doctor & { hospital?: Hospital | null })[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<(Doctor & { hospital?: Hospital | null }) | null>(null);

  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);

  // Completed booking
  const [bookedConsultation, setBookedConsultation] = useState<Consultation | null>(null);

  // Loading states
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Step 1: Load specialties on mount
  useEffect(() => {
    consultationsService.getTelehealthSpecialties().then((data) => {
      setSpecialties(data);
      setLoadingSpecialties(false);
    });
  }, []);

  // Check if a doctor was pre-selected via query params (e.g. from doctor profile)
  useEffect(() => {
    const doctorIdParam = searchParams.get('doctorId');
    if (doctorIdParam) {
      doctorsService.getDoctorById(doctorIdParam).then((res) => {
        if (res?.doctor) {
          setSelectedDoctor(res.doctor);
          setSelectedSpecialty(res.doctor.specialty);
          setSlots(res.slots);
          setCurrentStep(3); // Jump to slot selection
        }
      });
    }
  }, [searchParams]);

  // When specialty changes, load doctors
  const handleSelectSpecialty = (spec: string) => {
    setSelectedSpecialty(spec);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setLoadingDoctors(true);
    setCurrentStep(2);

    consultationsService.getDoctorsBySpecialty(spec).then((docs) => {
      setDoctors(docs);
      setLoadingDoctors(false);
    });
  };

  // When doctor is selected, load slots
  const handleSelectDoctor = (doc: Doctor & { hospital?: Hospital | null }) => {
    setSelectedDoctor(doc);
    setSelectedSlot(null);
    setLoadingSlots(true);
    setCurrentStep(3);

    consultationsService.getDoctorAvailableSlots(doc.id).then((slotData) => {
      setSlots(slotData);
      setLoadingSlots(false);
    });
  };

  // When slot is selected, go to confirmation form
  const handleSelectSlot = (slot: ConsultationSlot) => {
    setSelectedSlot(slot);
    setCurrentStep(4);
  };

  // Final submission of consultation booking
  const handleConfirmBooking = async (patientNotes: string) => {
    if (!selectedDoctor || !selectedSlot || !profile?.id) return;

    setSubmittingBooking(true);
    setBookingError(null);

    const { data, error } = await consultationsService.bookConsultation({
      doctorId: selectedDoctor.id,
      slotId: selectedSlot.id,
      patientId: profile.id,
      patientNotes,
    });

    setSubmittingBooking(false);

    if (error || !data) {
      setBookingError(error || 'Failed to complete consultation booking.');
    } else {
      setBookedConsultation(data);
      setCurrentStep(5); // Show confirmation view
    }
  };

  const handleResetWizard = () => {
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setBookedConsultation(null);
    setBookingError(null);
    setCurrentStep(1);
  };

  const stepsList = [
    { number: 1, title: 'Specialty' },
    { number: 2, title: 'Doctor' },
    { number: 3, title: 'Date & Slot' },
    { number: 4, title: 'Confirm' },
  ];

  return (
    <div className="py-10 sm:py-16 bg-neutral-bg min-h-screen">
      <Container size="md">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="primary" size="md">
            <Video className="w-3.5 h-3.5 mr-1" />
            Accredited Indian Telehealth Network
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-text">
            Schedule Video Consultation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed">
            Consult chief surgeons and clinical department heads from home before traveling to India. All consultations take place in encrypted clinical rooms.
          </p>
        </div>

        {/* Stepper Progress Bar (Only during steps 1-4) */}
        {currentStep <= 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-border -translate-y-1/2 z-0" />
              {stepsList.map((step) => {
                const isPassed = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div key={step.number} className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      disabled={step.number > currentStep}
                      onClick={() => {
                        if (step.number < currentStep) setCurrentStep(step.number);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPassed
                          ? 'bg-status-success text-white'
                          : isCurrent
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-neutral-surface text-neutral-muted border border-neutral-border'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                    </button>
                    <span
                      className={`text-[11px] mt-1.5 font-medium transition-colors ${
                        isCurrent
                          ? 'text-primary font-bold'
                          : isPassed
                          ? 'text-neutral-text'
                          : 'text-neutral-muted'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back navigation button if on step 2, 3, or 4 */}
        {currentStep > 1 && currentStep <= 4 && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {stepsList[currentStep - 2].title}</span>
            </button>

            {selectedDoctor && (
              <span className="text-xs text-neutral-muted hidden sm:inline-block">
                Selected Specialist: <strong>{selectedDoctor.full_name}</strong>
              </span>
            )}
          </div>
        )}

        {/* Dynamic Wizard Steps */}
        {currentStep === 1 && (
          <SpecialtyPicker
            specialties={specialties}
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={handleSelectSpecialty}
            loading={loadingSpecialties}
          />
        )}

        {currentStep === 2 && (
          <DoctorPicker
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={handleSelectDoctor}
            loading={loadingDoctors}
            specialtyName={selectedSpecialty || 'Specialty'}
          />
        )}

        {currentStep === 3 && selectedDoctor && (
          <SlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
            doctorName={selectedDoctor.full_name}
            loading={loadingSlots}
          />
        )}

        {currentStep === 4 && selectedDoctor && selectedSlot && (
          <ConsultationRequestForm
            doctor={selectedDoctor}
            slot={selectedSlot}
            profile={profile}
            onSubmit={handleConfirmBooking}
            loading={submittingBooking}
            error={bookingError}
          />
        )}

        {/* Step 5: Booking Confirmation Screen */}
        {currentStep === 5 && selectedDoctor && selectedSlot && (
          <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 sm:p-10 shadow-card text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-status-success/15 text-status-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-status-success uppercase tracking-wider">
                Booking Request Submitted Successfully
              </span>
              <h2 className="text-2xl font-heading font-bold text-neutral-text">
                Your Telehealth Consultation is Scheduled!
              </h2>
              <p className="text-xs text-neutral-muted max-w-md mx-auto leading-relaxed">
                We've reserved your appointment with <strong>{selectedDoctor.full_name}</strong>. Our clinical concierge will verify your medical details and generate your encrypted meeting room link.
              </p>
            </div>

            {/* Appointment Summary Box */}
            <div className="p-4 rounded-card bg-neutral-bg border border-neutral-border text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-border">
                <span className="text-neutral-muted">Booking Reference</span>
                <span className="font-mono font-bold text-neutral-text">
                  {bookedConsultation?.id.slice(0, 13).toUpperCase() || 'REF-CONSULT'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {new Date(selectedSlot.start_time).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <span>
                    {new Date(selectedSlot.start_time).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    –{' '}
                    {new Date(selectedSlot.end_time).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    (Indian Standard Time / UTC+5:30)
                  </span>
                </div>

                {selectedDoctor.hospital && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{selectedDoctor.hospital.name} ({selectedDoctor.hospital.city})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="text-left space-y-2.5 p-4 rounded-card bg-primary-light/30 border border-primary/20 text-xs text-neutral-text">
              <p className="font-bold flex items-center gap-1.5 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>Next Steps Before Your Video Call:</span>
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-neutral-muted text-[11px] leading-relaxed">
                <li>Check your registered email ({profile?.email}) for calendar invite and pre-consultation intake.</li>
                <li>Have recent medical reports, blood tests, or imaging discs ready for discussion.</li>
                <li>Your encrypted meeting link will be dispatched 12–24 hours before the session.</li>
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/dashboard/patient">
                <Button variant="primary" size="md">
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span>Go to Patient Dashboard</span>
                </Button>
              </Link>
              <Button variant="outline" size="md" onClick={handleResetWizard}>
                <RotateCcw className="w-4 h-4 mr-1.5" />
                <span>Book Another Consultation</span>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

