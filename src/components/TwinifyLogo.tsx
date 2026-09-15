import Image from "next/image";

type TwinifyLogoProps = {
  variant?: "white" | "black";
  className?: string;
  priority?: boolean;
  /** Show wordmark text next to mark */
  withWordmark?: boolean;
  size?: number;
};

export function TwinifyLogo({
  variant = "white",
  className = "",
  priority = false,
  withWordmark = true,
  size = 36,
}: TwinifyLogoProps) {
  const src =
    variant === "white"
      ? "/brand/twinify-logo-white.png"
      : "/brand/twinify-logo-black.png";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={size}
        className="no-drag h-auto w-auto"
        style={{ height: size, width: "auto" }}
        priority={priority}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        aria-hidden
      />
      {withWordmark ? (
        <span className="brand-mark text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Twinify
        </span>
      ) : (
        <span className="sr-only">Twinify</span>
      )}
    </span>
  );
}
