// Core application type definitions mirroring Supabase schema (§12)

export type UserRole = 'patient' | 'doctor' | 'hospital' | 'admin';

export type ReviewStatus = 'pending_review' | 'approved' | 'rejected' | 'suspended';

export type ConsultationPaymentStatus = 'unpaid' | 'mock_paid' | 'waived';

export type SecondOpinionStatus =
  | 'submitted'
  | 'under_review'
  | 'specialist_assigned'
  | 'responded'
  | 'closed';

export type QuoteStatus =
  | 'new'
  | 'under_review'
  | 'contacted'
  | 'quote_prepared'
  | 'awaiting_patient'
  | 'confirmed'
  | 'closed';

