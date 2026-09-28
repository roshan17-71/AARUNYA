import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { secondOpinionService, UploadedDocMetadata } from '../../services/secondOpinion.service';

interface DocumentUploaderProps {
  patientId: string;
  onDocumentsChange: (documents: UploadedDocMetadata[]) => void;
  maxFiles?: number;
}

interface FileUploadItem {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  metadata?: UploadedDocMetadata;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  patientId,
  onDocumentsChange,
  maxFiles = 6
}) => {
  const [fileList, setFileList] = useState<FileUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processAndUploadFiles = async (files: FileList | File[]) => {
    setGeneralError(null);

    const filesArray = Array.from(files);

    if (fileList.length + filesArray.length > maxFiles) {
      setGeneralError(`You can upload a maximum of ${maxFiles} documents per request.`);
      return;
    }

    const newItems: FileUploadItem[] = filesArray.map((file) => ({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: file.size,
      status: 'uploading'
    }));

    setFileList((prev) => [...prev, ...newItems]);

    // Upload each file
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const itemId = newItems[i].id;

      try {
        const metadata = await secondOpinionService.uploadMedicalDocument(file, patientId);

        setFileList((prev) => {
          const updated = prev.map((item) =>
            item.id === itemId
              ? { ...item, status: 'completed' as const, metadata }
              : item
          );

          // Emit successful documents
          const completedDocs = updated
            .filter((item) => item.status === 'completed' && item.metadata)
            .map((item) => item.metadata!);
          onDocumentsChange(completedDocs);

          return updated;
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed.';
        setFileList((prev) => {
          const updated = prev.map((item) =>
            item.id === itemId
              ? { ...item, status: 'error' as const, errorMessage: message }
              : item
          );
          return updated;
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAndUploadFiles(e.target.files);
      // Reset input value so re-selecting same file works
      e.target.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setFileList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      const completedDocs = updated
        .filter((item) => item.status === 'completed' && item.metadata)
        .map((item) => item.metadata!);
      onDocumentsChange(completedDocs);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-neutral-border hover:border-primary/50 hover:bg-neutral-background/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.zip"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-text">
              Click to browse or drag and drop your clinical records
            </p>
            <p className="text-xs text-neutral-muted mt-1">
              Supports PDF, Radiology images (JPEG/PNG), and DICOM scan archives (.ZIP). Max 15MB per file.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 pointer-events-none"
          >
            Select Documents
          </Button>
        </div>
      </div>

      {generalError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Uploaded Files List */}
      {fileList.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-xs font-semibold text-neutral-muted uppercase tracking-wider">
            Uploaded Files ({fileList.filter((f) => f.status === 'completed').length} / {fileList.length})
          </p>

          <div className="space-y-2">
            {fileList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white border border-neutral-border rounded-lg text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div className="p-2 bg-neutral-background rounded text-neutral-muted shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-neutral-text truncate max-w-xs md:max-w-md">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-neutral-muted text-[11px] mt-0.5">
                      <span>{formatFileSize(item.size)}</span>
                      <span>•</span>
                      {item.status === 'uploading' && (
                        <span className="flex items-center gap-1 text-primary">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Encrypting & Uploading...
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Encrypted & Ready
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <AlertCircle className="w-3 h-3" />
                          {item.errorMessage || 'Upload failed'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(item.id);
                  }}
                  className="p-1.5 text-neutral-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & Confidentiality Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-900 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Privacy & Confidentiality Protected:</span>
          {' '}Your medical records are stored in a restricted private vault and accessible exclusively by assigned reviewing specialists and multidisciplinary medical board members.
        </div>
      </div>
    </div>
  );
};

