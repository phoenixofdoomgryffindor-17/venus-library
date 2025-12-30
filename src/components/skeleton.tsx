"use client";

export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
