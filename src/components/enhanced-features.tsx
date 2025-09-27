'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Zap,
  Infinity,
  Shield,
  Palette,
  Download,
  Clock,
  Users,
  Award,
  Smartphone
} from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  benefits: string[];
  isNew?: boolean;
  isPopular?: boolean;
}


interface EnhancedFeaturesProps {
  title: string;
  subtitle: string;
}

export function EnhancedFeatures({ title, subtitle }: EnhancedFeaturesProps) {
  const t = useTranslations('features');

  const features = useMemo<FeatureItem[]>(() => [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('smartGenerator'),
      description: t('smartGeneratorDesc'),
      color: 'from-blue-500 to-cyan-500',
      benefits: [t('benefits.professionalResults'), t('benefits.optimizedForGemini'), t('benefits.testedPrompts')],
      isPopular: true
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: t('professionalTemplates'),
      description: t('professionalTemplatesDesc'),
      color: 'from-purple-500 to-pink-500',
      benefits: [t('benefits.allStyles'), t('benefits.monthlyUpdates'), t('benefits.organizedCategories')]
    },
    {
      icon: <Infinity className="w-8 h-8" />,
      title: t('unlimitedGenerations'),
      description: t('unlimitedGenerationsDesc'),
      color: 'from-green-500 to-emerald-500',
      benefits: [t('benefits.noLimits'), t('benefits.highQuality'), t('benefits.commercialUse')],
      isNew: true
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('fastResults'),
      description: t('fastResultsDesc'),
      color: 'from-orange-500 to-red-500',
      benefits: [t('benefits.ultraFast'), t('benefits.noWaiting'), t('benefits.instantProcessing')]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('privateSecure'),
      description: t('privateSecureDesc'),
      color: 'from-gray-600 to-gray-800',
      benefits: [t('benefits.dataProtected'), t('benefits.autoDelete'), t('benefits.lgpdCompliant')]
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: t('hdDownloads'),
      description: t('hdDownloadsDesc'),
      color: 'from-indigo-500 to-blue-600',
      benefits: [t('benefits.highResolution'), t('benefits.noWatermark'), t('benefits.professionalUse')]
    }
  ], [t]);

  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>(() =>
    new Array(features.length).fill(false)
  );

  useEffect(() => {
    setVisibleFeatures(new Array(features.length).fill(false));
  }, [features.length]);

  useEffect(() => {
    const timeouts: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          const index = Number(target.dataset.featureIndex);

          if (Number.isNaN(index)) {
            return;
          }

          const timeoutId = window.setTimeout(() => {
            setVisibleFeatures(prev => {
              if (prev[index]) {
                return prev;
              }

              const next = [...prev];
              next[index] = true;
              return next;
            });
          }, index * 100);

          timeouts.push(timeoutId);
          observer.unobserve(target);
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('[data-feature-card]');
    elements.forEach(el => observer.observe(el));

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [features.length]);

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-pink-50/30 rounded-3xl blur-3xl -z-10" />

      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <Award className="w-4 h-4 mr-1" />
          {t('badgeTitle')}
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            data-feature-card
            data-feature-index={index}
            className={`transform transition-all duration-700 ${
              visibleFeatures[index]
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <Card className="relative group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300`} />

              {/* Badges */}
              <div className="absolute top-4 right-4 space-y-1">
                {feature.isNew && (
                  <Badge className="bg-green-500 text-white text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t('badges.new')}
                  </Badge>
                )}
                {feature.isPopular && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {t('badges.popular')}
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color} mr-2 flex-shrink-0`} />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Hover effect indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg"
                     style={{ backgroundImage: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
          <Smartphone className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-700">
            {t('compatibility')}
          </span>
        </div>
      </div>
    </div>
  );
}
