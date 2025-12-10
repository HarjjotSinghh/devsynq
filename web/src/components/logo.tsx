'use client';

import Image from "next/image";
import logoImage from "../public/logo.png";

type LogoProps = {
  size?: number;
  withText?: boolean;
  className?: string;
  textClassName?: string;
  priority?: boolean;
};

export function Logo({
  size = 32,
  withText = true,
  className = "",
  textClassName = "",
  priority = false,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src={logoImage}
        alt="DevSynq logo"
        width={size}
        height={size}
        className="object-contain drop-shadow-sm select-none"
        priority={priority}
        draggable={false}
      />
      {withText && (
        <span className={`font-black text-xl tracking-tight text-foreground ${textClassName}`}>
          DevSynq
        </span>
      )}
    </span>
  );
}

