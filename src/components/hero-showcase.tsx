"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { buildLocalePath } from "@/lib/locale-path";
import type { Locale } from "@/i18n/config";
interface ShowcaseExample {
  id: string;
  beforeImage: string;
  afterImage: string;
  templateNameKey: 'linkedin' | 'dramatic' | 'rainbowHands';
  descriptionKey: string;
  templateId: string;
  prompt: string;
}

// Showcase examples with real before/after assets generated via the site's AI pipeline

const showcaseExamples: ShowcaseExample[] = [
  {
    id: "linkedin",
    beforeImage: "/showcase/linkedin-before.jpg",
    afterImage: "/showcase/linkedin-after.jpg",
    templateNameKey: "linkedin",
    descriptionKey: "linkedin",
    templateId: "pt-foto-profissional-1",
    prompt:
      "professional businessman in business suit, confident expression, corporate headshot",
  },
  {
    id: "dramatic",
    beforeImage: "/showcase/dramatic-before.jpg",
    afterImage: "/showcase/dramatic-after.jpg",
    templateNameKey: "dramatic",
    descriptionKey: "dramatic",
    templateId: "pt-ensaio-feminino-1",
    prompt:
      "beautiful woman with professional makeup and styling, dramatic lighting",
  },
  {
    id: "couple",
    beforeImage: "/showcase/couple-before.jpg",
    afterImage: "/showcase/couple-after.jpg",
    templateNameKey: "rainbowHands",
    descriptionKey: "rainbowHands",
    templateId: "pt-ensaio-casal-1",
    prompt:
      "two hands touching with a rainbow light prism across the skin, intimate and minimalist composition",
  },
];
export function HeroShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50); // For before/after slider

  const [isDragging, setIsDragging] = useState(false);
  const t = useTranslations("heroShowcase");
  const locale = useLocale();
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isPlaying]);
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseExamples.length);
      setIsTransitioning(false);
    }, 300);
  };
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) =>
          (prev - 1 + showcaseExamples.length) % showcaseExamples.length,
      );
      setIsTransitioning(false);
    }, 300);
  };
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  // Before/After slider handlers

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const updateSliderPosition = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };
  const currentExample = showcaseExamples[currentIndex];
  const templateName = t(`templateNames.${currentExample.templateNameKey}`);
  return (
    <div className="relative max-w-5xl mx-auto mt-16">
      {/* Background gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-3xl blur-3xl -z-10" />

      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
        {/* Header */}

        <div className="text-center mb-8">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4 animate-pulse"
          >
            {t("badge")}
          </Badge>

          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            {t("title")}
          </h3>

          <p className="text-gray-600 text-lg mb-4">
            {t(`examples.${currentExample.descriptionKey}`)}
          </p>

          {/* Play/Pause controls */}

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={togglePlayPause}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}

              {isPlaying ? t("pauseDemo") : t("playDemo")}
            </Button>

            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {showcaseExamples.length}
            </span>
          </div>
        </div>

        {/* Interactive Before/After Comparison */}

        <div className="relative mb-8">
          <div
            className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl cursor-ew-resize transition-opacity duration-300 ${
              isTransitioning ? "opacity-50" : "opacity-100"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Before Image (Background) */}

            <div className="absolute inset-0">
              <img
                src={currentExample.beforeImage}
                alt="Before transformation"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* After Image (Clipped) */}

            <div
              className="absolute inset-0"
              style={{
                clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`,
              }}
            >
              {currentExample.afterImage ? (
                <div className="absolute inset-0">
                  <img
                    src={currentExample.afterImage}
                    alt="After transformation"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 mix-blend-overlay" />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-10 h-10" />
                    </div>

                    <p className="text-lg font-semibold">{t("aiResult")}</p>

                    <p className="text-sm opacity-90">
                      {templateName}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                </div>
              )}
            </div>

            {/* Slider Line */}

            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Slider Handle */}

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
              </div>
            </div>

            {/* Labels */}

            <Badge className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm">
              {t("before")}
            </Badge>

            <Badge className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm">
              {t("after")}
            </Badge>

            {/* Navigation arrows */}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
              disabled={isTransitioning}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
              disabled={isTransitioning}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Instructions */}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">{t("dragInstruction")}</p>
          </div>
        </div>

        {/* Template Info and CTA */}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Badge variant="outline" className="mb-2">
                {t("template")}: {templateName}
              </Badge>

              <p className="text-sm text-gray-600">
                {t("templateDescription")}
              </p>
            </div>

            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              asChild
            >
              <Link
                href={buildLocalePath(
                  locale as Locale,
                  `/generator?template=${encodeURIComponent(currentExample.templateId)}`
                )}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t("tryTemplate")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Indicators */}

        <div className="flex justify-center space-x-3">
          {showcaseExamples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => !isTransitioning && setCurrentIndex(index)}
              className={`relative transition-all duration-200 ${
                index === currentIndex ? "scale-110" : "hover:scale-105"
              }`}
              disabled={isTransitioning}
            >
              <div
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={example.beforeImage}
                  alt={`Example ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {index === currentIndex && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

