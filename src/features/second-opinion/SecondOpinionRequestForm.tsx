import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DocumentUploader } from './DocumentUploader';
import {
  secondOpinionService,
  UploadedDocMetadata
} from '../../services/secondOpinion.service';
import { SecondOpinionService, SecondOpinionRequest } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface SecondOpinionRequestFormProps {
  services: SecondOpinionService[];
  initialServiceSlug?: string;
}

export const SecondOpinionRequestForm: React.FC<SecondOpinionRequestFormProps> = ({
  services,
  initialServiceSlug
}) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Find initial service
  const initialService =
    services.find((s) => s.slug === initialServiceSlug) || services[0];

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService ? initialService.id : ''
  );
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [symptomsAndHistory, setSymptomsAndHistory] = useState('');
  const [specificQuestions, setSpecificQuestions] = useState('');
  const [documents, setDocuments] = useState<UploadedDocMetadata[]>([]);
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<SecondOpinionRequest | null>(null);

  const currentService = services.find((s) => s.id === selectedServiceId) || initialService;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user || !profile) {
      setSubmitError('You must be signed in as a patient to submit a second opinion request.');
      return;
    }

    if (!selectedServiceId) {
      setSubmitError('Please select a second opinion service tier.');
      return;
    }

    if (!primaryDiagnosis.trim()) {
      setSubmitError('Please state your current diagnosis or the primary health concern.');
      return;
    }

    if (!symptomsAndHistory.trim()) {
      setSubmitError('Please provide a brief summary of your symptoms and clinical history.');
      return;
    }

    if (!consentConfirmed) {
      setSubmitError('Please confirm the medical advisory acknowledgment before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Assemble combined condition description
      const fullDescription = `
PRIMARY DIAGNOSIS:
${primaryDiagnosis.trim()}

CLINICAL HISTORY & CURRENT SYMPTOMS:
${symptomsAndHistory.trim()}

SPECIFIC QUESTIONS FOR THE SPECIALIST:
${specificQuestions.trim() || 'No specific questions provided.'}
      `.trim();

      const result = await secondOpinionService.createRequest({
        patientId: user.id,
        serviceId: selectedServiceId,
        conditionDescription: fullDescription,
        documents
      });

      setCreatedRequest(result.request);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An error occurred during submission.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (createdRequest) {
    return (
      <Card className="max-w-2xl mx-auto p-8 border-emerald-200 bg-white shadow-md text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <Badge variant="success" className="mb-2">
          Request Submitted Successfully
        </Badge>

        <h2 className="text-2xl font-bold font-serif text-neutral-text">
          Second Medical Opinion Initiated
        </h2>

        <p className="text-sm text-neutral-muted mt-2 max-w-lg mx-auto">
          Thank you, <span className="font-semibold text-neutral-text">{profile?.full_name || 'Patient'}</span>.
          Your medical records have been securely stored in our clinical portal.
        </p>

        {/* Request Details Box */}
        <div className="bg-neutral-background/70 border border-neutral-border rounded-xl p-5 my-6 text-left space-y-3">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-border">
            <span className="text-neutral-muted">Request ID:</span>
            <span className="font-mono font-bold text-neutral-text">{createdRequest.id}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-border">
            <span className="text-neutral-muted">Service Tier:</span>
            <span className="font-semibold text-primary">{currentService?.name}</span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-border">
            <span className="text-neutral-muted">Initial Status:</span>
            <Badge variant="warning">Under Clinical Triaging</Badge>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-muted">Uploaded Documents:</span>
            <span className="font-medium text-neutral-text">{documents.length} File(s) Encrypted</span>
          </div>
        </div>

        <div className="bg-primary-light/40 border border-primary/20 rounded-lg p-4 text-xs text-primary-dark text-left mb-6">
          <p className="font-semibold mb-1">What Happens Next?</p>
          <ul className="list-disc pl-4 space-y-1 text-neutral-muted">
            <li>Our international clinical coordinator will review your submitted reports within 12–24 hours.</li>
            <li>An accredited Indian super-specialist will be assigned to evaluate your case.</li>
            <li>You will receive an email notification when the written report or teleconsultation is scheduled.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/second-opinion')}
          >
            Back to Second Opinion
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/dashboard/patient')}
          >
            Go to Patient Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  // ACTIVE REQUEST FORM
  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      {/* 1. Selected Tier Summary & Switcher */}
      <Card className="p-6 border-neutral-border bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-border">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Step 1 of 4 • Service Tier
            </span>
            <h3 className="text-lg font-bold text-neutral-text font-serif mt-1">
              Select Advisory Scope
            </h3>
          </div>
          {currentService?.indicative_price && (
            <Badge variant="info" className="text-sm font-bold">
              ${currentService.indicative_price} USD
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {services.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedServiceId(tier.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedServiceId === tier.id
                  ? 'border-primary bg-primary-light/30 ring-1 ring-primary'
                  : 'border-neutral-border hover:border-neutral-muted bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-neutral-text">
                  {tier.name}
                </span>
                <span className="text-xs font-bold text-primary">
                  ${tier.indicative_price}
                </span>
              </div>
              <p className="text-[11px] text-neutral-muted mt-1 line-clamp-2">
                {tier.description}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* 2. Patient Identity Confirmation */}
      <Card className="p-6 border-neutral-border bg-white shadow-sm">
        <div className="pb-4 border-b border-neutral-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step 2 of 4 • Patient Information
          </span>
          <h3 className="text-lg font-bold text-neutral-text font-serif mt-1">
            Registered Patient Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3 bg-neutral-background rounded-lg border border-neutral-border">
            <span className="text-neutral-muted block">Full Name</span>
            <span className="font-semibold text-neutral-text">{profile?.full_name || '—'}</span>
          </div>
          <div className="p-3 bg-neutral-background rounded-lg border border-neutral-border">
            <span className="text-neutral-muted block">Email Address</span>
            <span className="font-semibold text-neutral-text truncate block">{profile?.email || '—'}</span>
          </div>
          <div className="p-3 bg-neutral-background rounded-lg border border-neutral-border">
            <span className="text-neutral-muted block">Country of Residence</span>
            <span className="font-semibold text-neutral-text">{profile?.country || 'International'}</span>
          </div>
        </div>
      </Card>

      {/* 3. Clinical History & Condition Description */}
      <Card className="p-6 border-neutral-border bg-white shadow-sm space-y-5">
        <div className="pb-4 border-b border-neutral-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step 3 of 4 • Medical Context
          </span>
          <h3 className="text-lg font-bold text-neutral-text font-serif mt-1">
            Clinical History & Symptoms
          </h3>
          <p className="text-xs text-neutral-muted mt-1">
            Provide comprehensive context so our specialist can formulate an accurate evaluation.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-text mb-1">
            Current Diagnosis or Suspected Condition <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={primaryDiagnosis}
            onChange={(e) => setPrimaryDiagnosis(e.target.value)}
            placeholder="e.g. Lumbar Canal Stenosis, Triple Vessel CAD, Stage II Breast Carcinoma"
            className="w-full text-xs rounded-lg border border-neutral-border px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-text mb-1">
            Summary of Symptoms, Onset & Current Medications <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={symptomsAndHistory}
            onChange={(e) => setSymptomsAndHistory(e.target.value)}
            placeholder="Please detail your symptom duration, severity, treatments already tried, and current daily prescriptions..."
            className="w-full text-xs rounded-lg border border-neutral-border px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-text mb-1">
            Key Questions for the Specialist <span className="text-neutral-muted font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={specificQuestions}
            onChange={(e) => setSpecificQuestions(e.target.value)}
            placeholder="e.g. Is surgery urgently necessary? Are there robotic or minimally invasive alternatives? Is the proposed chemotherapy protocol optimal?"
            className="w-full text-xs rounded-lg border border-neutral-border px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </Card>

      {/* 4. Secure Document Uploader */}
      <Card className="p-6 border-neutral-border bg-white shadow-sm">
        <div className="pb-4 border-b border-neutral-border mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step 4 of 4 • Diagnostic Documents
          </span>
          <h3 className="text-lg font-bold text-neutral-text font-serif mt-1">
            Upload Medical Records & Scans
          </h3>
          <p className="text-xs text-neutral-muted mt-1">
            Attach discharge summaries, lab tests, histopathology biopsies, and radiology DICOM or image files.
          </p>
        </div>

        {user ? (
          <DocumentUploader
            patientId={user.id}
            onDocumentsChange={(uploadedDocs) => setDocuments(uploadedDocs)}
          />
        ) : (
          <div className="p-4 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
            Please sign in to securely upload confidential clinical records.
          </div>
        )}
      </Card>

      {/* Regulatory & Advisory Disclaimer */}
      <div className="p-4 rounded-xl bg-neutral-surface border border-neutral-border text-xs space-y-3">
        <div className="flex items-start gap-2.5 text-neutral-muted">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-neutral-text">Clinical Advisory Disclaimer:</strong>
            {' '}A second medical opinion is an independent review of documentation provided by you. It is intended to inform patient decision-making in partnership with your treating primary care physician. It does not establish a formal doctor-patient emergency relationship or guarantee specific health outcomes.
          </p>
        </div>

        <label className="flex items-start gap-2.5 pt-2 border-t border-neutral-border/60 cursor-pointer">
          <input
            type="checkbox"
            checked={consentConfirmed}
            onChange={(e) => setConsentConfirmed(e.target.checked)}
            className="rounded border-neutral-border text-primary focus:ring-primary mt-0.5"
          />
          <span className="text-neutral-text font-medium select-none">
            I confirm that I have read the clinical advisory terms and consent to sharing my medical records with authorized reviewing specialists.
          </span>
        </label>
      </div>

      {submitError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Form Submission Action */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/second-opinion')}
          className="flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting || !consentConfirmed}
          className="flex items-center gap-2 min-w-[200px] justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Request...</span>
            </>
          ) : (
            <span>Submit Opinion Request</span>
          )}
        </Button>
      </div>
    </form>
  );
};

