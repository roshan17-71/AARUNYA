// Core application type definitions mirroring Supabase schema (§12)

export type UserRole = 'patient' | 'doctor' | 'hospital' | 'admin';

export type ReviewStatus = 'pending_review' | 'approved' | 'rejected' | 'suspended';

export type PackageStatus = 'draft' | 'published' | 'archived';

export type ConsultationStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

export type ConsultationPaymentStatus = 'unpaid' | 'mock_paid' | 'waived';

export type SecondOpinionStatus =
  | 'submitted'
  | 'under_review'
  | 'specialist_assigned'
  | 'responded'
  | 'closed';

export type RelatedRequestType = 'second_opinion' | 'quote' | 'consultation' | 'general';

export type QuoteStatus =
  | 'new'
  | 'under_review'
  | 'contacted'
  | 'quote_prepared'
  | 'awaiting_patient'
  | 'confirmed'
  | 'closed';

export type AdvisorRequestStatus = 'new' | 'contacted' | 'closed';

// 12.1 profiles
export interface Profile {
  id: string; // matches auth.users.id
  role: UserRole;
  full_name: string;
  country: string | null;
  phone_country_code: string | null;
  phone_number: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// 12.2 doctors
export interface Doctor {
  id: string;
  profile_id: string | null;
  hospital_id: string | null;
  full_name: string;
  specialty: string;
  specialties: string[];
  bio: string | null;
  qualifications: string | null;
  experience_years: number;
  languages: string[];
  city: string;
  country: string;
  consultation_fee: number | null;
  consultation_duration_minutes: number | null;
  video_consultation_enabled: boolean;
  profile_image_url: string | null;
  status: ReviewStatus;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

// 12.4 hospitals
export interface Hospital {
  id: string;
  profile_id: string | null;
  name: string;
  slug: string;
  city: string;
  country: string;
  description: string | null;
  specialties: string[];
  accreditations: string[];
  facilities: string[];
  international_patient_services: string[];
  images: string[];
  status: ReviewStatus;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

// 12.5 treatments
export interface TreatmentFaq {
  question: string;
  answer: string;
}

export interface Treatment {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  category: string;
  overview: string | null;
  description: string | null;
  indications: string | null;
  process: string | null;
  recovery_info: string | null;
  estimated_duration: string | null;
  faqs: TreatmentFaq[];
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// 12.6 treatment_hospitals
export interface TreatmentHospital {
  id: string;
  treatment_id: string;
  hospital_id: string;
}

// 12.7 treatment_doctors
export interface TreatmentDoctor {
  id: string;
  treatment_id: string;
  doctor_id: string;
}

// 12.8 packages
export interface Package {
  id: string;
  hospital_id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  included_services: string[];
  estimated_price: number | null;
  currency: string;
  duration: string | null;
  eligibility_info: string | null;
  status: PackageStatus;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

// 12.10 consultation_slots
export interface ConsultationSlot {
  id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
}

// 12.9 consultations
export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string | null;
  status: ConsultationStatus;
  payment_status: ConsultationPaymentStatus;
  meeting_url: string | null;
  patient_notes: string | null;
  created_at: string;
  updated_at: string;
}

// 12.11 second_opinion_services
export interface SecondOpinionService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  indicative_price: number | null;
  created_at: string;
}

// 12.12 second_opinion_requests
export interface SecondOpinionRequest {
  id: string;
  patient_id: string;
  service_id: string;
  condition_description: string;
  status: SecondOpinionStatus;
  assigned_doctor_id: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// 12.13 medical_documents
export interface MedicalDocument {
  id: string;
  patient_id: string;
  related_request_type: RelatedRequestType;
  related_request_id: string | null;
  storage_path: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  created_at: string;
}

// 12.14 treatment_quote_requests
export interface TreatmentQuoteRequest {
  id: string;
  patient_id: string | null;
  treatment_id: string | null;
  hospital_id: string | null;
  full_name: string;
  country: string;
  email: string;
  phone: string;
  medical_condition: string;
  preferred_travel_date: string | null;
  message: string | null;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

// 12.15 advisor_requests
export interface AdvisorRequest {
  id: string;
  patient_id: string | null;
  full_name: string;
  country: string;
  contact: string;
  treatment_or_condition: string;
  preferred_communication_method: string;
  preferred_time: string | null;
  message: string | null;
  status: AdvisorRequestStatus;
  created_at: string;
  updated_at: string;
}

// 12.16 patient_stories
export interface PatientStory {
  id: string;
  display_name: string;
  country: string;
  treatment_id: string | null;
  hospital_id: string | null;
  story: string;
  image_url: string | null;
  consent_confirmed: boolean;
  is_published: boolean;
  is_demo: boolean;
  created_at: string;
}

// 12.17 visa_information
export interface OfficialLink {
  label: string;
  url: string;
}

export interface VisaInformation {
  id: string;
  country: string | null;
  title: string;
  content: string;
  official_links: OfficialLink[];
  last_reviewed_at: string;
  created_at: string;
  updated_at: string;
}

// 12.18 saved_doctors / saved_hospitals
export interface SavedDoctor {
  id: string;
  patient_id: string;
  doctor_id: string;
  created_at: string;
}

export interface SavedHospital {
  id: string;
  patient_id: string;
  hospital_id: string;
  created_at: string;
}
