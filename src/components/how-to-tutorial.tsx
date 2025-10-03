'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function HowToTutorial() {
  const t = useTranslations('howToTutorial');

  const calloutIcon = '⭐';

  const steps = [
    {
      number: 1,
      icon: '🎯',
      title: t('steps.0.title'),
      description: t('steps.0.description'),
      tip: t('steps.0.tip'),
    },
    {
      number: 2,
      icon: '📸',
      title: t('steps.1.title'),
      description: t('steps.1.description'),
      tip: t('steps.1.tip'),
    },
    {
      number: 3,
      icon: '✍️',
      title: t('steps.2.title'),
      description: t('steps.2.description'),
      tip: t('steps.2.tip'),
    },
    {
      number: 4,
      icon: '⚙️',
      title: t('steps.3.title'),
      description: t('steps.3.description'),
      tip: t('steps.3.tip'),
    },
    {
      number: 5,
      icon: '🚀',
      title: t('steps.4.title'),
      description: t('steps.4.description'),
      tip: t('steps.4.tip'),
    },
    {
      number: 6,
      icon: '💾',
      title: t('steps.5.title'),
      description: t('steps.5.description'),
      tip: t('steps.5.tip'),
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            {t('badge')}
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:gap-6">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="relative overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-600" />
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl" aria-hidden>
                        {step.icon}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm text-blue-900">
                        <strong className="font-semibold">💡 {t('tipLabel')}:</strong> {step.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-6xl" aria-hidden>
              {calloutIcon}
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('callout.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('callout.description')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#generator-section"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('callout.cta')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
