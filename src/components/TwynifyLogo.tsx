import Image from "next/image";

type TwynifyLogoProps = {
  variant?: "white" | "black";
  className?: string;
  priority?: boolean;
  /** Show wordmark text next to mark */
  withWordmark?: boolean;
  size?: number;
};

export function TwynifyLogo({
  variant = "white",
  className = "",
  priority = false,
  withWordmark = true,
  size = 36,
}: TwynifyLogoProps) {
  const src =
    variant === "white"
      ? "/brand/twynify-logo-white.png"
      : "/brand/twynify-logo-black.png";

  return (
    <span
      className={`inline-flex select-none items-center gap-2.5 ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitTouchCallout: "none" }}
    >
      <span className="pointer-events-none inline-block select-none" style={{ WebkitTouchCallout: "none" }}>
        <Image
          src={src}
          alt=""
          width={size * 2}
          height={size}
          className="no-drag brand-logo pointer-events-none h-auto w-auto select-none"
          style={{
            height: size,
            width: "auto",
            WebkitTouchCallout: "none",
            pointerEvents: "none",
            userSelect: "none",
          }}
          priority={priority}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          aria-hidden
        />
      </span>
      {withWordmark ? (
        <span className="brand-mark select-none text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Twynify
        </span>
      ) : (
        <span className="sr-only">Twynify</span>
      )}
    </span>
  );
}
