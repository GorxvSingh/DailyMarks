export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bookmark shape */}
      <path
        d="M8 4C8 1.79 9.79 0 12 0H52C54.21 0 56 1.79 56 4V58L32 46L8 58V4Z"
        className="fill-accent"
      />
    </svg>
  );
}
