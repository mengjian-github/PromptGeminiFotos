'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Play } from 'lucide-react';

interface EnhancedCTAProps {
  primaryText: string;
  secondaryText: string;
  freeGenerations?: number;
}

export function EnhancedCTA({
  primaryText,
  secondaryText,
  freeGenerations = 2
}: EnhancedCTAProps) {
  const t = useTranslations('cta');
  const [isHovering, setIsHovering] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleEffect(true);
      setTimeout(() => setSparkleEffect(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToGenerator = () => {
    const generator = document.getElementById('generator-section');
    if (generator) {
      generator.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-12">
      {/* Free generations highlight */}
      <div className="text-center mb-6">
        <Badge
          variant="secondary"
          className={`bg-gradient-to-r from-green-400 to-blue-500 text-white transition-all duration-300 ${
            sparkleEffect ? 'animate-pulse scale-105' : ''
          }`}
        >
          <Sparkles className="w-4 h-4 mr-1" />
          {freeGenerations} {t('freeGenerations')} - {t('noCardRequired')}
        </Badge>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {/* Primary CTA */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 blur transition-all duration-300 group-hover:blur-lg" />

          <Button
            size="lg"
            className="relative w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={scrollToGenerator}
          >
            <Sparkles className={`w-5 h-5 mr-2 transition-transform duration-300 ${
              isHovering ? 'rotate-12 scale-110' : ''
            }`} />
            {primaryText}
            {isHovering && (
              <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse" />
            )}
          </Button>
        </div>

        {/* Secondary CTA */}
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold"
          onClick={() => {
            const features = document.getElementById('features');
            if (features) {
              features.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Play className="w-5 h-5 mr-2" />
          {secondaryText}
        </Button>
      </div>

      {/* Trust indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          {t('resultsInSeconds')}
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
          {t('securePrivate')}
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
          {t('optimizedGemini')}
        </div>
      </div>

      {/* Social proof */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500 mb-2">
          {t('usedBy')} <span className="font-semibold text-gray-700">10.000</span> {t('contentCreators')}
        </p>

        {/* Testimonial preview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/30 max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-2">
            "{t('testimonialQuote')}"
          </p>
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-2" />
            <span className="text-xs text-gray-500">{t('testimonialAuthor')}</span>
            <div className="flex ml-2">
              {'★'.repeat(5).split('').map((star, i) => (
                <span key={i} className="text-yellow-400 text-xs">{star}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



