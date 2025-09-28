'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, List, Crown } from 'lucide-react';
import { promptTemplates, Template, TemplateTier } from '@/lib/templates';
import { usePagination } from '@/hooks/use-pagination';
import { buildLocalePath } from '@/lib/locale-path';
import type { Locale } from '@/i18n/config';

interface TemplatesBrowserProps {
  initialTemplates?: Template[];
  initialTier?: TierFilter;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'alphabetical' | 'recent';

type CategoryFilter = 'all' | Template['category'];
type StyleFilter = 'all' | Template['style'];
type TierFilter = 'all' | TemplateTier;

const sortTemplates = (templates: Template[], sortBy: SortOption): Template[] => {
  return [...templates].sort((a, b) => {
    if (sortBy === 'recent') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    }

    return a.name.localeCompare(b.name);
  });
};

export function TemplatesBrowser({ initialTemplates = promptTemplates, initialTier }: TemplatesBrowserProps) {
  const t = useTranslations('templatesPage.browser');
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [style, setStyle] = useState<StyleFilter>('all');
  const [tier, setTier] = useState<TierFilter>(initialTier ?? 'all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const dataset = useMemo(() => initialTemplates, [initialTemplates]);

  useEffect(() => {
    setTier(initialTier ?? 'all');
  }, [initialTier]);

  const categoryOptions = useMemo<CategoryFilter[]>(() => {
    const values = Array.from(new Set(dataset.map((item) => item.category))).sort();
    return ['all', ...values] as CategoryFilter[];
  }, [dataset]);

  const styleOptions = useMemo<StyleFilter[]>(() => {
    const values = Array.from(new Set(dataset.map((item) => item.style))).sort();
    return ['all', ...values] as StyleFilter[];
  }, [dataset]);

  const tierOptions: TierFilter[] = ['all', 'free', 'premium'];

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return dataset.filter((template) => {
      if (category !== 'all' && template.category !== category) {
        return false;
      }

      if (style !== 'all' && template.style !== style) {
        return false;
      }

      if (tier !== 'all' && template.tier !== tier) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        template.name.toLowerCase().includes(normalizedQuery) ||
        template.description.toLowerCase().includes(normalizedQuery) ||
        template.prompt.toLowerCase().includes(normalizedQuery) ||
        template.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [category, dataset, searchQuery, style, tier]);

  const sortedTemplates = useMemo(
    () => sortTemplates(filteredTemplates, sortBy),
    [filteredTemplates, sortBy]
  );

  const { page, setPage, totalPages, paginatedItems: paginatedTemplates, startIndex, endIndex } =
    usePagination(sortedTemplates);
  return (
    <div className="space-y-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-4">
          <div className="xl:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.ariaLabel')}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="xl:col-span-2">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryFilter)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('filters.categories.label')}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`filters.categories.${option}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2">
            <select
              value={style}
              onChange={(event) => setStyle(event.target.value as StyleFilter)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('filters.styles.label')}
            >
              {styleOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`filters.styles.${option}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="xl:col-span-2 grid grid-cols-2 gap-3">
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value as TierFilter)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('filters.tier.label')}
            >
              {tierOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`filters.tier.${option}`)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('filters.sort.label')}
            >
              <option value="alphabetical">{t('filters.sort.alphabetical')}</option>
              <option value="recent">{t('filters.sort.recent')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="text-sm text-gray-600">
            {t('resultsCount', { count: sortedTemplates.length })}
          </div>
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              className={viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              {t('view.grid')}
            </Button>
            <Button
              type="button"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              className={viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              {t('view.list')}
            </Button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
        {paginatedTemplates.map((template) => {
          const categoryLabel = t(`filters.categories.${template.category}`);
          const styleLabel = t(`filters.styles.${template.style}`);
          const generatorHref = buildLocalePath(
            locale as Locale,
            `/generator?template=${encodeURIComponent(template.id)}`
          );

          return (
            <Card
              key={template.id}
              className={
                viewMode === 'grid'
                  ? 'group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/95 border border-gray-100'
                  : 'group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/95 border border-gray-100'
              }
            >
              <div className={viewMode === 'grid' ? 'relative aspect-[4/3] overflow-hidden' : 'relative h-56 overflow-hidden'}>
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  {template.tier === 'premium' ? (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow">
                      <Crown className="w-3 h-3 mr-1" />
                      {t('badges.premium')}
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 shadow">
                      {t('badges.free')}
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {template.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">{template.description}</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{categoryLabel}</Badge>
                  <Badge variant="outline">{styleLabel}</Badge>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    asChild
                  >
                    <Link href={generatorHref}>
                      {template.tier === 'premium' ? t('card.ctaPremium') : t('card.ctaFree')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedTemplates.length > 0 && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600">
            {t('pagination.summary', {
              start: numberFormatter.format(startIndex + 1),
              end: numberFormatter.format(endIndex),
              total: numberFormatter.format(sortedTemplates.length)
            })}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {t('pagination.page', { current: page, total: totalPages })}
            </span>
            <div className="inline-flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                {t('pagination.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              >
                {t('pagination.next')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {sortedTemplates.length === 0 && (
        <div className="text-center py-16 bg-white/80 rounded-xl border border-dashed border-gray-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
          <p className="text-gray-600 mb-4">{t('empty.description')}</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setCategory('all');
              setStyle('all');
              setTier('all');
              setSortBy('alphabetical');
            }}
          >
            {t('empty.reset')}
          </Button>
        </div>
      )}
    </div>
  );
}






