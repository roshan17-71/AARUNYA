import { supabase } from '../lib/supabaseClient';
import { SecondOpinionService, SecondOpinionRequest, MedicalDocument } from '../types';

export const FALLBACK_SECOND_OPINION_SERVICES: SecondOpinionService[] = [
  {
    id: 'so-tier-1',
    name: 'Clinical Review (Basic)',
    slug: 'clinical-review',
    description: 'Independent clinical evaluation of primary diagnosis, current symptom profile, and drug regimen by an accredited Indian super-specialist. Deliverable includes an advisory clinical report and pharmacological suggestions within 48–72 hours.',
    indicative_price: 99.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'so-tier-2',
    name: 'Medical Record & Radiology Review',
    slug: 'medical-record-review',
    description: 'In-depth clinical appraisal of your complete medical history combined with expert secondary radiological interpretation (MRI, CT, PET, Ultrasound) and laboratory pathology reviews. Includes treatment alternatives and surgical indications.',
    indicative_price: 199.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'so-tier-3',
    name: 'Comprehensive Review + Video Consultation',
    slug: 'review-video-consultation',
    description: 'Complete diagnostic record and imaging re-assessment coupled with a dedicated 30-minute direct live teleconsultation with a leading super-specialist. Includes pre-consultation notes and post-session priority action plan.',
    indicative_price: 349.00,
    created_at: new Date().toISOString()
  },
  {
    id: 'so-tier-4',
    name: 'Multidisciplinary Tumor & Case Board Review',
    slug: 'multidisciplinary-case-review',
    description: 'Joint multidisciplinary review by a specialized panel of senior clinicians (Surgical Specialist, Medical Oncologist/Physician, Radiologist, and Pathologist). Delivers a formal consensus panel assessment for complex or high-risk cases.',
    indicative_price: 599.00,
    created_at: new Date().toISOString()
  }
];

export interface UploadedDocMetadata {
  storagePath: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
}

export interface CreateSecondOpinionPayload {
  patientId: string;
  serviceId: string;
  conditionDescription: string;
  documents: UploadedDocMetadata[];
}

export const secondOpinionService = {
  /**
   * Fetch all second opinion service tiers ordered by price
   */
  async getServices(): Promise<SecondOpinionService[]> {
    try {
      const { data, error } = await supabase
        .from('second_opinion_services')
        .select('*')
        .order('indicative_price', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_SECOND_OPINION_SERVICES;
      }

      return data as SecondOpinionService[];
    } catch {
      return FALLBACK_SECOND_OPINION_SERVICES;
    }
  },

  /**
   * Fetch a single second opinion service tier by slug
   */
  async getServiceBySlug(slug: string): Promise<SecondOpinionService | null> {
    try {
      const { data, error } = await supabase
        .from('second_opinion_services')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        return (
          FALLBACK_SECOND_OPINION_SERVICES.find((s) => s.slug === slug) || null
        );
      }

      return data as SecondOpinionService;
    } catch {
      return (
        FALLBACK_SECOND_OPINION_SERVICES.find((s) => s.slug === slug) || null
      );
    }
  },

  /**
   * Upload an individual medical document to the private 'medical-documents' storage bucket
   */
  async uploadMedicalDocument(
    file: File,
    patientId: string
  ): Promise<UploadedDocMetadata> {
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSizeBytes) {
      throw new Error(`File "${file.name}" exceeds the maximum 15MB limit.`);
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/zip',
      'application/x-zip-compressed'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.zip')) {
      throw new Error(
        `Invalid file type for "${file.name}". Please upload PDF, JPEG, PNG, or ZIP archives.`
      );
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const filePath = `${patientId}/${timestamp}_${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from('medical-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
    }

    return {
      storagePath: filePath,
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSizeBytes: file.size
    };
  },

  /**
   * Create a second opinion request and link uploaded medical documents
   */
  async createRequest(
    payload: CreateSecondOpinionPayload
  ): Promise<{ request: SecondOpinionRequest; documents: MedicalDocument[] }> {
    const { patientId, serviceId, conditionDescription, documents } = payload;

    // 1. Insert the request record
    const { data: requestData, error: requestError } = await supabase
      .from('second_opinion_requests')
      .insert({
        patient_id: patientId,
        service_id: serviceId,
        condition_description: conditionDescription,
        status: 'submitted',
        payment_status: 'unpaid'
      })
      .select()
      .single();

    if (requestError || !requestData) {
      throw new Error(requestError?.message || 'Failed to submit second opinion request.');
    }

    const newRequest = requestData as SecondOpinionRequest;
    const insertedDocs: MedicalDocument[] = [];

    // 2. Link documents if any were uploaded
    if (documents.length > 0) {
      const docsToInsert = documents.map((doc) => ({
        patient_id: patientId,
        related_request_type: 'second_opinion',
        related_request_id: newRequest.id,
        storage_path: doc.storagePath,
        file_name: doc.fileName,
        file_type: doc.fileType,
        file_size_bytes: doc.fileSizeBytes
      }));

      const { data: docsData, error: docsError } = await supabase
        .from('medical_documents')
        .insert(docsToInsert)
        .select();

      if (!docsError && docsData) {
        insertedDocs.push(...(docsData as MedicalDocument[]));
      }
    }

    return {
      request: newRequest,
      documents: insertedDocs
    };
  },

  /**
   * Generate a secure short-lived signed URL for viewing an uploaded document
   */
  async getDocumentSignedUrl(
    storagePath: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from('medical-documents')
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(error?.message || 'Unable to generate secure download link.');
    }

    return data.signedUrl;
  }
};

