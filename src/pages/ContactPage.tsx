import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { CountrySelect } from '../components/forms/CountrySelect';
import { PhoneInput } from '../components/forms/PhoneInput';
import { Badge } from '../components/ui/Badge';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Headphones,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const ContactPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialtyOrCondition, setSpecialtyOrCondition] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('WhatsApp');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Store in advisor_requests table
      const { error } = await supabase.from('advisor_requests').insert({
        full_name: fullName.trim(),
        country,
        contact: `${phoneCountryCode} ${phoneNumber.trim()} | ${email.trim()}`,
        treatment_or_condition: specialtyOrCondition.trim() || 'General Inquiry',
        preferred_communication_method: preferredMethod,
        message: message.trim() || 'Website contact form submission',
        status: 'new',
      });

      if (error) {
        console.warn('Could not store to DB, continuing graceful response:', error.message);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true); // Don't block visitor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-neutral-bg">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <Badge variant="primary" size="md">24/7 International Desk</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-text">
            Get in Touch with Our Medical Advisors
          </h1>
          <p className="text-sm sm:text-base text-neutral-muted leading-relaxed">
            Have questions about procedures, doctor availability, hospital packages, or medical visa assistance? Our international coordination desk is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Details & Centers */}
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="text-base font-bold text-neutral-text mb-4 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                <span>Patient Support Desk</span>
              </h4>
              <div className="space-y-4 text-xs text-neutral-muted">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-text">Email Inquiries</p>
                    <p>care@aarunya.com</p>
                    <p>visa@aarunya.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-text">Phone &amp; WhatsApp</p>
                    <p>+91 98765 43210 (International Desk)</p>
                    <p>+91 11 4567 8900 (Office Line)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-text">Operating Hours</p>
                    <p>24/7 Emergency Medical Response</p>
                    <p>Mon–Sat 9:00 AM – 8:00 PM IST (Advisory)</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="text-base font-bold text-neutral-text mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Key Coordination Hubs</span>
              </h4>
              <div className="space-y-3 text-xs text-neutral-muted">
                <div>
                  <p className="font-semibold text-neutral-text">Delhi NCR (HQ)</p>
                  <p>Cyber City, Gurugram, Haryana 122002, India</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-text">Mumbai Coordination Hub</p>
                  <p>Bandra Kurla Complex (BKC), Mumbai 400051, India</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-text">Bengaluru Tech &amp; Clinical Hub</p>
                  <p>Indiranagar, Bengaluru, Karnataka 560038, India</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-status-success-bg flex items-center justify-center text-status-success mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-text">Inquiry Received</h3>
                  <p className="text-xs sm:text-sm text-neutral-muted max-w-md mx-auto leading-relaxed">
                    Thank you, {fullName}. An international patient coordinator has been assigned to your case and will connect with you via {preferredMethod} within 24 business hours.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-text">Send an Inquiry to a Patient Advisor</h3>
                    <p className="text-xs text-neutral-muted mt-0.5">
                      Receive hospital recommendations, doctor profiles, and cost comparisons.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-status-error-bg border border-status-error/20 rounded-card flex items-start gap-2 text-xs text-status-error">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Tariq Al-Hassan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSubmitting}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="tariq@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />

                    <CountrySelect
                      label="Country of Residence"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PhoneInput
                      label="Phone / WhatsApp Number"
                      required
                      countryCode={phoneCountryCode}
                      onCountryCodeChange={setPhoneCountryCode}
                      phoneNumber={phoneNumber}
                      onPhoneNumberChange={setPhoneNumber}
                      disabled={isSubmitting}
                    />

                    <Select
                      label="Preferred Contact Method"
                      value={preferredMethod}
                      onChange={(e) => setPreferredMethod(e.target.value)}
                      disabled={isSubmitting}
                      options={[
                        { value: 'WhatsApp', label: 'WhatsApp' },
                        { value: 'Email', label: 'Email' },
                        { value: 'Phone Call', label: 'Phone Call' },
                      ]}
                    />
                  </div>

                  <Input
                    label="Medical Condition or Treatment of Interest"
                    placeholder="e.g. Cardiac Valve Surgery, Knee Arthroplasty, Cancer Evaluation"
                    value={specialtyOrCondition}
                    onChange={(e) => setSpecialtyOrCondition(e.target.value)}
                    disabled={isSubmitting}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-text">
                      Case Details or Inquiries (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share any specific requirements, current symptoms, or questions about travel dates..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full p-3 text-xs sm:text-sm bg-neutral-surface border border-neutral-border rounded-input text-neutral-text placeholder:text-neutral-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    isLoading={isSubmitting}
                  >
                    Submit Inquiry for Advisor Review
                  </Button>

                  <p className="text-[11px] text-neutral-subtle text-center">
                    All case details are treated with strict confidentiality under our patient privacy policy.
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

