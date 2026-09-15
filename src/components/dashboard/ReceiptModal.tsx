"use client";

import { useEffect, useState } from "react";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  dataUrl: string | null;
  file: File | null;
  filename?: string;
  onShare?: () => Promise<void>;
  onDownload?: () => void;
}

export function ReceiptModal({
  open,
  onClose,
  dataUrl,
  file,
  filename = "twynify-receipt.png",
  onShare,
  onDownload,
}: ReceiptModalProps) {
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !dataUrl) return null;

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  const handleShareClick = async () => {
    if (onShare) {
      setSharing(true);
      try {
        await onShare();
      } finally {
        setSharing(false);
      }
      return;
    }

    if (typeof navigator !== "undefined" && navigator.share && file) {
      setSharing(true);
      try {
        await navigator.share({
          files: [file],
          title: "Twynify Receipt",
        });
      } catch (err: unknown) {
        if ((err as { name?: string })?.name !== "AbortError") {
          console.error("Share failed", err);
        }
      } finally {
        setSharing(false);
      }
    }
  };

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Twynify Receipt Preview"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog container */}
      <div className="relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#150a26] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-semibold tracking-wide text-brand-100">
            Receipt Image
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-200 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Mobile / iOS Instructions */}
        <div className="bg-brand-950/60 border-b border-brand-800/30 px-4 py-2.5 text-center">
          <p className="text-xs text-brand-200 flex items-center justify-center gap-1.5 font-medium">
            <span className="text-base" aria-hidden>📱</span>
            {isIOS ? (
              <span>
                <strong>iPhone:</strong> Press &amp; hold the image below to{" "}
                <span className="underline decoration-brand-400">Save to Photos</span>, or tap Share.
              </span>
            ) : (
              <span>
                Press &amp; hold image to save, or use the buttons below.
              </span>
            )}
          </p>
        </div>

        {/* Image Preview */}
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center min-h-0 bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt="Twynify Receipt"
            className="max-h-[52dvh] w-auto max-w-full rounded-lg shadow-2xl object-contain select-auto touch-auto"
            style={{
              WebkitTouchCallout: "default",
              userSelect: "auto",
            }}
          />
        </div>

        {/* Actions */}
        <div className="border-t border-white/10 p-3 bg-[#11071f] flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShareClick}
              disabled={sharing}
              className="min-h-11 flex-1 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 active:scale-[0.98] disabled:opacity-50"
            >
              {sharing ? "Sharing…" : "Share / Save to Photos"}
            </button>

            <button
              type="button"
              onClick={handleDownloadClick}
              className="min-h-11 flex-1 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-900 transition hover:bg-brand-50 active:scale-[0.98]"
            >
              Download PNG
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-10 w-full rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-brand-300 transition hover:bg-white/5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
