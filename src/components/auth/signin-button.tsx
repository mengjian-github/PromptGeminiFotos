"use client";

import type { Locale } from "@/i18n/config";
import { buildLocalePath } from "@/lib/locale-path";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

interface SignInButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  label?: string;
}

export function SignInButton({ variant = "default", size = "default", className, label }: SignInButtonProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const labelText = label ?? t("hero.cta");

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        const target = document.getElementById("generator-section");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          return;
        }
        window.location.href = buildLocalePath(locale, "/") + "#generator-section";
      }}
    >
      {labelText}
    </Button>
  );
}
