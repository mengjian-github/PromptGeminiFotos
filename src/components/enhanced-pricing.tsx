'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Check,
  Crown,
  Zap,
  Star,
  TrendingUp,
  Users,
  Sparkles,
  Gift,
  Clock,
  Mail
} from 'lucide-react';
import type { UserSubscriptionData } from '@/lib/subscription';
import type { Locale } from '@/i18n/config';
import { buildLocalePath } from '@/lib/locale-path';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  yearlyPeriod?: string;
  yearlyDiscount?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  color: string;
  icon: React.ReactNode;
  savings?: string;
}

interface EnhancedPricingProps {
  title: string;
  subtitle: string;
}

export function EnhancedPricing({ title, subtitle }: EnhancedPricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(null);
  const t = useTranslations('pricing');
  const locale = useLocale();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/subscription')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubscription(data.data);
          }
        })
        .catch(err => console.error('Failed to fetch subscription:', err));
    }
  }, [session]);

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      if (!session?.user) {
        // Directly trigger Google sign in, just like the sign in button
        signIn('google', {
          callbackUrl: buildLocalePath(locale as Locale, '/'),
        });
        return;
      }

      // Call subscription API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Redirect to Creem checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start subscription process');
    } finally {
      setIsLoading(false);
    }
  };

  const formatMonthlyEquivalent = (rawPrice: string) => {
    const numeric = Number(rawPrice.replace(/[^0-9.,-]/g, '').replace(',', '.'));

    if (!Number.isFinite(numeric) || numeric <= 0) {
      return null;
    }

    const monthlyAmount = numeric / 12;

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(monthlyAmount);
    } catch (error) {
      return `$${monthlyAmount.toFixed(2)}`;
    }
  };

  const tiers: PricingTier[] = [
    {
      name: t('free.title'),
      price: t('free.price'),
      period: t('free.period'),
      features: [
        t('free.features.0'),
        t('free.features.1'),
        t('free.features.2'),
        t('free.features.3')
      ],
      buttonText: t('free.cta'),
      color: 'from-green-400 to-green-600',
      icon: <Gift className="w-6 h-6" />
    },
    {
      name: t('pro.title'),
      price: isYearly ? t('pro.yearlyPrice') : t('pro.price'),
      period: isYearly ? t('pro.yearlyPeriod') : t('pro.period'),
      yearlyPrice: t('pro.yearlyPrice'),
      yearlyPeriod: t('pro.yearlyPeriod'),
      yearlyDiscount: t('pro.yearlyDiscount'),
      features: [
        t('pro.features.0'),
        t('pro.features.1'),
        t('pro.features.2'),
        t('pro.features.3'),
        t('pro.features.4'),
        t('pro.features.5')
      ],
      buttonText: t('pro.cta'),
      isPopular: true,
      color: 'from-blue-500 to-purple-600',
      icon: <Crown className="w-6 h-6" />,
      savings: isYearly ? t('pro.yearlySavings') : undefined
    }
  ];

  return (
    <div className="relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <TrendingUp className="w-4 h-4 mr-1" />
            {t('flexiblePlans')}
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className={`text-sm ${!isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('billing.monthly')}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('billing.yearly')}
            </span>
            {isYearly && (
              <Badge className="bg-green-500 text-white ml-2 animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('billing.discount')}
              </Badge>
            )}
          </div>

          {/* Popular choice indicator */}
          <div className="text-center">
            <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
              <Users className="w-3 h-3 mr-1" />
              {t('popularChoice')}
            </Badge>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-8">
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t('valueProposition')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const monthlyEquivalent =
              tier.yearlyPrice && isYearly ? formatMonthlyEquivalent(tier.yearlyPrice) : null;

            return (
              <Card
                key={tier.name}
                className={`relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  tier.isPopular
                    ? 'border-2 border-blue-500 shadow-xl scale-105'
                    : 'border-2 border-green-300 hover:border-green-400 shadow-lg bg-gradient-to-br from-green-50/50 to-white'
                } bg-white/80 backdrop-blur-sm`}
              >
              {/* Popular badge */}
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {t('pro.popular')}
                  </Badge>
                </div>
              )}

              {/* Free badge */}
              {!tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1">
                    <Gift className="w-3 h-3 mr-1" />
                    {t('free.startNow')}
                  </Badge>
                </div>
              )}

              {/* Glow effect */}
              {tier.isPopular && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg blur-xl -z-10" />
              )}

              <CardHeader className="text-center pb-4">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {tier.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className={`text-5xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      {tier.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {tier.period}
                    </span>
                  </div>

                  {/* Yearly savings */}
                  {tier.savings && isYearly && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-700">
                        <Clock className="w-3 h-3 mr-1" />
                        {tier.savings}
                      </Badge>
                    </div>
                  )}

                  {/* Monthly equivalent for yearly */}
                  {monthlyEquivalent && (
                    <p className="text-sm text-gray-500 mt-2">
                      {t('billing.monthlyEquivalent', { amount: monthlyEquivalent })}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Current Plan Badge */}
                {subscription && (
                  // Show badge for free plan
                  (!tier.isPopular && subscription.subscriptionStatus === 'free') ||
                  // Show badge for pro plan only if billing period matches
                  (tier.isPopular && subscription.subscriptionStatus === 'pro' &&
                   ((isYearly && subscription.planType === 'yearly') ||
                    (!isYearly && subscription.planType === 'monthly')))
                ) && (
                  <div className="mb-4 text-center">
                    <Badge className="bg-blue-100 text-blue-700">
                      <Check className="w-3 h-3 mr-1" />
                      Current Plan
                    </Badge>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  size="lg"
                  className={`w-full mb-6 transition-all duration-300 ${
                    tier.isPopular
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                  }`}
                  disabled={isLoading || (
                    subscription?.subscriptionStatus === 'pro' && tier.isPopular &&
                    ((isYearly && subscription.planType === 'yearly') ||
                     (!isYearly && subscription.planType === 'monthly'))
                  )}
                  onClick={() => {
                    if (tier.isPopular) {
                      // Handle Pro subscription
                      handleSubscribe(isYearly ? 'yearly' : 'monthly');
                    } else {
                      // Free plan - scroll to generator
                      const generator = document.getElementById('generator-section');
                      if (generator) {
                        generator.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      {tier.isPopular && <Crown className="w-4 h-4 mr-2" />}
                      {tier.buttonText}
                    </>
                  )}
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Additional benefits for pro */}
                {tier.isPopular && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                      {t('pro.exclusiveBenefits')}
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• {t('pro.exclusiveList.0')}</li>
                      <li>• {t('pro.exclusiveList.1')}</li>
                      <li>• {t('pro.exclusiveList.2')}</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              {t('trust.cancelAnytime')}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              {t('trust.support247')}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
              {t('trust.securePayment')}
            </div>
          </div>

          {/* Satisfaction guarantee */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/30 inline-block">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">{t('trust.guaranteeTitle')}</strong> {t('trust.guaranteeDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
