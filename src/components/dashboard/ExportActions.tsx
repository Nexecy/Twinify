"use client";

import { toPng } from "html-to-image";
import { useState } from "react";

interface ExportActionsProps {
  receiptRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

async function renderReceipt(node: HTMLDivElement) {
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: undefined,
  });
}

export function ExportActions({ receiptRef, disabled }: ExportActionsProps) {
  const [busy, setBusy] = useState<"save" | "copy" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const withNode = async (action: "save" | "copy", fn: (dataUrl: string) => Promise<void>) => {
    const node = receiptRef.current;
    if (!node) return;
    setBusy(action);
    setMessage(null);
    try {
      const dataUrl = await renderReceipt(node);
      await fn(dataUrl);
    } catch {
      setMessage("Could not export receipt. Try again.");
    } finally {
      setBusy(null);
    }
  };

  const saveImage = () =>
    withNode("save", async (dataUrl) => {
      const link = document.createElement("a");
      link.download = `twinify-receipt-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setMessage("Saved as PNG.");
    });

  const copyImage = () =>
    withNode("copy", async (dataUrl) => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error("Clipboard not supported");
      }
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setMessage("Copied to clipboard.");
    });

  const share = async () => {
    const node = receiptRef.current;
    if (!node) return;
    setBusy("save");
    setMessage(null);
    try {
      const dataUrl = await renderReceipt(node);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "twinify-receipt.png", {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Twinify receipt",
          text: "My Spotify listening receipt from Twinify",
        });
        setMessage("Shared.");
      } else {
        await saveImage();
      }
    } catch {
      setMessage("Share unavailable — try Save as Image.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="w-full space-y-2 text-center">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          disabled={disabled || busy !== null}
          onClick={saveImage}
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 transition hover:bg-brand-50 disabled:opacity-50"
        >
          {busy === "save" ? "Saving…" : "Save as Image"}
        </button>
        <button
          type="button"
          disabled={disabled || busy !== null}
          onClick={copyImage}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-brand-50 hover:bg-white/10 disabled:opacity-50"
        >
          {busy === "copy" ? "Copying…" : "Copy to Clipboard"}
        </button>
        <button
          type="button"
          disabled={disabled || busy !== null}
          onClick={share}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-brand-50 hover:bg-white/10 disabled:opacity-50"
        >
          Share
        </button>
      </div>
      {message ? (
        <p className="text-xs text-brand-200" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
