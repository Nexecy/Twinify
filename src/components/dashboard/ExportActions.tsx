"use client";

import { toPng } from "html-to-image";
import { useCallback, useState } from "react";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";
import { useTwynifyStore } from "@/store/twynify-store";
import type { ItemType, TimeRange } from "@/types/spotify";

interface ExportActionsProps {
  receiptRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  compact?: boolean;
}

interface ExportPayload {
  dataUrl: string;
  blob: Blob;
  file: File;
}

export function buildReceiptFilename(
  itemType: ItemType,
  timeRange: TimeRange,
): string {
  if (itemType === "genres") {
    return "twynify-top-genres.png";
  }

  const rangeSlug =
    timeRange === "short_term"
      ? "last-month"
      : timeRange === "medium_term"
        ? "last-6-months"
        : "all-time";

  const typeSlug = itemType === "stats" ? "stats" : `top-${itemType}`;

  return `twynify-${typeSlug}-${rangeSlug}.png`;
}

function isIOS(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

async function renderReceiptToImage(
  node: HTMLDivElement,
  filename: string,
): Promise<ExportPayload> {
  // Ensure custom web fonts (IBM Plex Mono, Share Tech Mono) are loaded
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue even if font ready check fails
    }
  }

  const pixelRatio = typeof window !== "undefined"
    ? Math.min(Math.max(window.devicePixelRatio || 2, 2), 3)
    : 2;

  const options = {
    cacheBust: true,
    pixelRatio,
    backgroundColor: undefined,
    style: {
      // Reset receipt rotation tilt during export to prevent Safari SVG clipping
      transform: "none",
      margin: "0 auto",
    },
  };

  // Pre-flight check for Safari WebKit rasterizer
  const isSafari =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    try {
      await toPng(node, options);
    } catch {
      // Ignore preflight warm-up error
    }
  }

  const dataUrl = await toPng(node, options);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], filename, {
    type: "image/png",
  });

  return { dataUrl, blob, file };
}

export function ExportActions({
  receiptRef,
  disabled,
  compact,
}: ExportActionsProps) {
  const [busy, setBusy] = useState<"save" | "share" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPayload, setCurrentPayload] = useState<ExportPayload | null>(
    null,
  );

  const itemType = useTwynifyStore((s) => s.itemType);
  const timeRange = useTwynifyStore((s) => s.timeRange);
  const filename = buildReceiptFilename(itemType, timeRange);

  const getPayload = useCallback(async (): Promise<ExportPayload | null> => {
    const node = receiptRef.current;
    if (!node) return null;
    return await renderReceiptToImage(node, filename);
  }, [receiptRef, filename]);

  const saveImage = async () => {
    setBusy("save");
    setMessage(null);
    try {
      const payload = await getPayload();
      if (!payload) {
        setMessage("Receipt not ready yet.");
        return;
      }
      setCurrentPayload(payload);

      // On iOS Safari, <a download> does not work for data/blob URLs.
      // Use native Web Share API (which includes native "Save Image" to Photos),
      // or open the preview modal where user can tap & hold to save to Photos.
      if (isIOS()) {
        if (
          navigator.share &&
          navigator.canShare?.({ files: [payload.file] })
        ) {
          try {
            await navigator.share({
              files: [payload.file],
              title: "My Twynify Receipt",
            });
            setMessage("Saved via Share Sheet.");
            return;
          } catch (err: unknown) {
            if ((err as { name?: string })?.name === "AbortError") {
              // User dismissed the share sheet; do not show error
              return;
            }
            // If user gesture expired or share rejected, fallback to modal
            setModalOpen(true);
            return;
          }
        }
        // If web share files is unsupported on iOS, open modal
        setModalOpen(true);
        return;
      }

      // Desktop & standard browsers: direct file download with clean custom name
      const link = document.createElement("a");
      link.download = filename;
      link.href = payload.dataUrl;
      link.click();
      setMessage("Saved as PNG.");
    } catch (err) {
      console.error("Save image failed", err);
      setMessage("Could not export receipt. Try again.");
    } finally {
      setBusy(null);
    }
  };

  const share = async () => {
    setBusy("share");
    setMessage(null);
    try {
      const payload = await getPayload();
      if (!payload) {
        setMessage("Receipt not ready yet.");
        return;
      }
      setCurrentPayload(payload);

      if (navigator.share && navigator.canShare?.({ files: [payload.file] })) {
        try {
          await navigator.share({
            files: [payload.file],
            title: "My Twynify Receipt",
            text: "My Spotify listening receipt from Twynify",
          });
          setMessage("Shared.");
          return;
        } catch (err: unknown) {
          if ((err as { name?: string })?.name === "AbortError") {
            // User dismissed share sheet
            return;
          }
          // If transient activation timed out or share failed, open modal
          setModalOpen(true);
          return;
        }
      }

      // If navigator.share files is unsupported, open modal for saving/sharing
      setModalOpen(true);
    } catch (err) {
      console.error("Share failed", err);
      setModalOpen(true);
    } finally {
      setBusy(null);
    }
  };

  const btnBase = compact
    ? "min-h-11 flex-1 rounded-full px-3 py-2.5 text-xs font-semibold"
    : "min-h-11 rounded-full px-6 py-2.5 text-sm font-semibold";

  return (
    <>
      <div
        className={`w-full ${compact ? "space-y-1" : "space-y-2"} text-center`}
      >
        <div
          className={`flex ${compact ? "gap-2" : "flex-wrap justify-center gap-3"}`}
        >
          <button
            type="button"
            disabled={disabled || busy !== null}
            onClick={saveImage}
            className={`${btnBase} bg-white text-brand-900 transition hover:bg-brand-50 active:scale-[0.98] disabled:opacity-50`}
          >
            {busy === "save"
              ? "Saving…"
              : compact
                ? "Save"
                : "Save as Image"}
          </button>
          <button
            type="button"
            disabled={disabled || busy !== null}
            onClick={share}
            className={`${btnBase} border border-white/15 bg-white/5 text-brand-50 hover:bg-white/10 active:scale-[0.98] disabled:opacity-50`}
          >
            {busy === "share" ? "Preparing…" : "Share"}
          </button>
        </div>
        {message && !compact ? (
          <p className="text-xs text-brand-200" role="status">
            {message}
          </p>
        ) : null}
      </div>

      <ReceiptModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dataUrl={currentPayload?.dataUrl ?? null}
        file={currentPayload?.file ?? null}
        filename={filename}
      />
    </>
  );
}
