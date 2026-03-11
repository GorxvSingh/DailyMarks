"use client";

import { useEffect, useRef, useState } from "react";

type AnimateInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade-up" | "fade" | "scale" | "blur";
};

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const variants = {
    "fade-up": {
      hidden: "opacity-0 translate-y-8 blur-sm",
      visible: "opacity-100 translate-y-0 blur-0",
    },
    fade: {
      hidden: "opacity-0 blur-sm",
      visible: "opacity-100 blur-0",
    },
    scale: {
      hidden: "opacity-0 scale-90 blur-sm",
      visible: "opacity-100 scale-100 blur-0",
    },
    blur: {
      hidden: "opacity-0 blur-md",
      visible: "opacity-100 blur-0",
    },
  };

  const v = variants[variant];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? v.visible : v.hidden
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
