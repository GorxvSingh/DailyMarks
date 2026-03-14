import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "sm";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover",
    outline:
      "border border-border text-foreground hover:bg-surface-light",
    ghost: "text-muted hover:text-foreground hover:bg-surface-light",
  };

  const sizes = {
    default: "h-[44px] px-6 text-base",
    sm: "h-[36px] px-4 text-sm",
  };

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    // Use plain <a> for API routes to prevent Next.js prefetching
    if (href.startsWith("/api/")) {
      return (
        <a href={href} className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
