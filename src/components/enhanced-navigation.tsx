"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Menu, X, Camera, Home, CreditCard, FileText } from "lucide-react";
import { buildLocalePath, isPathActive } from "@/lib/locale-path";
import type { Locale } from "@/i18n/config";

type NavigationItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
};

export function EnhancedNavigation() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const brandName = t('brand');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = useMemo<NavigationItem[]>(() => {
    const currentPath = pathname || "/";

    return [
      {
        href: buildLocalePath(locale, "/"),
        label: t("home"),
        icon: Home,
        isActive: isPathActive(currentPath, locale, "/"),
      },
      {
        href: buildLocalePath(locale, "/templates"),
        label: t("templates"),
        icon: FileText,
        isActive: isPathActive(currentPath, locale, "/templates"),
      },
      {
        href: buildLocalePath(locale, "/#pricing"),
        label: t("pricing"),
        icon: CreditCard,
        isActive: currentPath.includes("#pricing"),
      },
    ];
  }, [locale, pathname, t]);

  const logoHref = buildLocalePath(locale, "/");

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={logoHref} className="flex items-center space-x-3 group">
            <div className="relative">
              <Camera
                className={`h-8 w-8 transition-all duration-300 ${
                  isScrolled ? "text-blue-600" : "text-blue-500"
                } group-hover:scale-110 group-hover:text-purple-600`}
              />
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
            </div>
            <div className="hidden sm:block">
              <span
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-gray-800"
                } group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent`}
              >
                {brandName}
              </span>
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs">
                AI
              </Badge>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 group ${
                    item.isActive
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
                      item.isActive ? "text-blue-600" : ""
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>

                  {item.isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300" />
            )}
          </Button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-2 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 rounded-b-lg">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                    item.isActive
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className={`h-5 w-5 ${item.isActive ? "text-blue-600" : ""}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <div className="flex justify-end px-3 pt-2 border-t border-gray-200/50">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200/30">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: "0%" }} />
      </div>
    </nav>
  );
}

