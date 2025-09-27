"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Crown, Search, Sparkles, Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  promptTemplates,
  searchTemplates,
  type Template,
  type TemplateCategory,
  type TemplateStyle,
  type TemplateTier
} from "@/lib/templates";
import { usePagination } from "@/hooks/use-pagination";

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
  userTier: "free" | "pro";
  selectedTemplate?: Template | null;
  onClose?: () => void;
}

type CategoryOption = "all" | TemplateCategory;
type StyleOption = "all" | TemplateStyle;
type TierOption = "all" | TemplateTier;
type SortOption = "popular" | "rating" | "newest";

const sortTemplates = (templates: Template[], sortBy: SortOption) => {
  return [...templates].sort((a, b) => {
    if (sortBy === "popular") {
      if (b.popularity === a.popularity) {
        return b.rating - a.rating;
      }
      return b.popularity - a.popularity;
    }

    if (sortBy === "rating") {
      if (b.rating === a.rating) {
        return b.popularity - a.popularity;
      }
      return b.rating - a.rating;
    }

    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
};

export function TemplateSelector({
  onTemplateSelect,
  userTier,
  selectedTemplate,
  onClose
}: TemplateSelectorProps) {
  const locale = useLocale();
  const tPicker = useTranslations("templatePicker");
  const tTemplates = useTranslations("templatesPage.browser");

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const categories = Array.from(
      new Set(promptTemplates.map((template) => template.category))
    );
    return ["all", ...categories] as CategoryOption[];
  }, []);

  const styleOptions = useMemo<StyleOption[]>(() => {
    const styles = Array.from(
      new Set(promptTemplates.map((template) => template.style))
    );
    return ["all", ...styles] as StyleOption[];
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryOption>("all");
  const [styleFilter, setStyleFilter] = useState<StyleOption>("all");
  const [tierFilter, setTierFilter] = useState<TierOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const dataset = useMemo(
    () => (searchQuery.trim() ? searchTemplates(searchQuery) : promptTemplates),
    [searchQuery]
  );

  const filteredTemplates = useMemo(() => {
    return dataset.filter((template) => {
      if (categoryFilter !== "all" && template.category !== categoryFilter) {
        return false;
      }

      if (styleFilter !== "all" && template.style !== styleFilter) {
        return false;
      }

      if (tierFilter !== "all" && template.tier !== tierFilter) {
        return false;
      }

      return true;
    });
  }, [dataset, categoryFilter, styleFilter, tierFilter]);

  const sortedTemplates = useMemo(
    () => sortTemplates(filteredTemplates, sortBy),
    [filteredTemplates, sortBy]
  );

  const {
    page,
    setPage,
    totalPages,
    paginatedItems: paginatedTemplates,
    startIndex,
    endIndex
  } = usePagination(sortedTemplates);

  const handleSelect = (template: Template) => {
    onTemplateSelect(template);
    onClose?.();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-gray-900">
          {tPicker("title")}
        </h3>
        <p className="text-sm text-gray-600">
          {tPicker("subtitle", { count: numberFormatter.format(promptTemplates.length) })}
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={tPicker("searchPlaceholder")}
            className="pl-10"
          />
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col">
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as CategoryOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder={tPicker("filters.categoryLabel")} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all"
                    ? tTemplates("filters.categories.all")
                    : tTemplates(`filters.categories.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={styleFilter}
            onValueChange={(value) => setStyleFilter(value as StyleOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder={tPicker("filters.styleLabel")} />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all"
                    ? tTemplates("filters.styles.all")
                    : tTemplates(`filters.styles.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tierFilter}
            onValueChange={(value) => setTierFilter(value as TierOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder={tPicker("filters.tierLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tPicker("filters.tier.all")}</SelectItem>
              <SelectItem value="free">{tPicker("filters.tier.free")}</SelectItem>
              <SelectItem value="premium">{tPicker("filters.tier.premium")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger>
              <SelectValue placeholder={tPicker("filters.sortLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{tPicker("filters.sort.popular")}</SelectItem>
              <SelectItem value="rating">{tPicker("filters.sort.rating")}</SelectItem>
              <SelectItem value="newest">{tPicker("filters.sort.newest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {tPicker("results", { count: numberFormatter.format(sortedTemplates.length) })}
        </span>
        {userTier === "free" && (
          <span className="flex items-center gap-2 text-xs text-orange-600">
            <Crown className="h-4 w-4" />
            {tPicker("premiumHint")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paginatedTemplates.map((template) => {
          const isPremium = template.tier === "premium";
          const isSelected = selectedTemplate?.id === template.id;
          const isLocked = isPremium && userTier === "free";

          return (
            <Card
              key={template.id}
              className={`relative overflow-hidden border transition-all duration-300 ${
                isSelected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-blue-300 hover:shadow"} ${
                isLocked ? "opacity-70" : ""
              }`}
            >
              {isLocked && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="flex items-center gap-2 text-sm font-medium text-white">
                    <Crown className="h-4 w-4" />
                    {tPicker("badges.premium")}
                  </span>
                </div>
              )}

              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-black/60 text-white backdrop-blur-sm">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {numberFormatter.format(template.popularity)}
                  </Badge>
                  {isPremium ? (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                      <Crown className="mr-1 h-3 w-3" />
                      {tPicker("badges.premium")}
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                      {tPicker("badges.free")}
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 line-clamp-2">
                      {template.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="h-4 w-4" />
                    {template.rating.toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <Badge variant="outline">
                    {tTemplates(`filters.categories.${template.category}`)}
                  </Badge>
                  <Badge variant="outline">
                    {tTemplates(`filters.styles.${template.style}`)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    {tPicker("usage", { count: numberFormatter.format(template.usageCount) })}
                  </span>
                  <Button
                    size="sm"
                    className={
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    }
                    disabled={isLocked}
                    onClick={() => handleSelect(template)}
                  >
                    {isSelected ? tPicker("actions.selected") : tPicker("actions.select")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedTemplates.length > 0 && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-gray-600">
          <div>
            {tTemplates("pagination.summary", {
              start: numberFormatter.format(startIndex + 1),
              end: numberFormatter.format(endIndex),
              total: numberFormatter.format(sortedTemplates.length)
            })}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {tTemplates("pagination.page", { current: page, total: totalPages })}
            </span>
            <div className="inline-flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                {tTemplates("pagination.previous")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              >
                {tTemplates("pagination.next")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {sortedTemplates.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
          <Sparkles className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h4 className="text-lg font-semibold text-gray-900">{tPicker("empty.title")}</h4>
          <p className="mt-2 text-sm text-gray-600">{tPicker("empty.description")}</p>
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={() => onClose?.()}>
          {tPicker("close")}
        </Button>
      </div>
    </div>
  );
}
