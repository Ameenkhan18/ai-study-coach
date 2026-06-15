"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { PDFDocument } from "@/lib/types";
import { formatFileSize, generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PDFUploaderProps {
  onDocumentAdded: (doc: PDFDocument) => void;
  onDocumentRemoved: (id: string) => void;
  documents: PDFDocument[];
}

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
  fileName?: string;
}

export default function PDFUploader({
  onDocumentAdded,
  onDocumentRemoved,
  documents,
}: PDFUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });

  const uploadFile = useCallback(async (file: File) => {
    setUploadState({ status: "uploading", fileName: file.name });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadState({ status: "error", message: data.error || "Upload failed" });
        setTimeout(() => setUploadState({ status: "idle" }), 4000);
        return;
      }

      const newDoc: PDFDocument = {
        id: generateId(),
        name: data.name,
        content: data.content,
        pageCount: data.pageCount,
        uploadedAt: new Date(),
        size: data.size,
      };

      onDocumentAdded(newDoc);
      setUploadState({ status: "success", fileName: file.name });
      setTimeout(() => setUploadState({ status: "idle" }), 2500);
    } catch {
      setUploadState({ status: "error", message: "Network error. Please try again." });
      setTimeout(() => setUploadState({ status: "idle" }), 4000);
    }
  }, [onDocumentAdded]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploadState.status === "uploading",
  });

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-accent bg-accent-light drop-active"
            : "border-border hover:border-accent-dim hover:bg-surface-hover",
          uploadState.status === "uploading" && "opacity-70 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        {uploadState.status === "uploading" ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <Loader2 size={22} className="text-accent animate-spin" />
            <p className="text-sm text-muted">Processing {uploadState.fileName}…</p>
          </div>
        ) : uploadState.status === "success" ? (
          <div className="flex flex-col items-center gap-2 py-1 animate-fade-in">
            <CheckCircle2 size={22} className="text-green-500" />
            <p className="text-sm text-green-600 font-medium">Added successfully!</p>
          </div>
        ) : uploadState.status === "error" ? (
          <div className="flex flex-col items-center gap-2 py-1 animate-fade-in">
            <AlertCircle size={22} className="text-red-500" />
            <p className="text-sm text-red-600">{uploadState.message}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isDragActive ? "bg-accent/10" : "bg-accent-light"
            )}>
              <Upload size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {isDragActive ? "Drop your PDF here" : "Upload a PDF"}
              </p>
              <p className="text-xs text-muted mt-0.5">Drag & drop or click · Max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide px-1">
            Loaded Documents
          </p>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-2.5 bg-surface border border-border rounded-xl p-3 group animate-fade-in"
            >
              <div className="mt-0.5 p-1.5 bg-accent-light rounded-lg flex-shrink-0">
                <FileText size={14} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{doc.name}</p>
                <p className="text-xs text-muted mt-0.5">
                  {doc.pageCount} {doc.pageCount === 1 ? "page" : "pages"} · {formatFileSize(doc.size)}
                </p>
              </div>
              <button
                onClick={() => onDocumentRemoved(doc.id)}
                className="mt-0.5 p-1 rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove document"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
