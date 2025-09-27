"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TemplateSelector } from "@/components/template-selector";
import {
  promptTemplates,
  type Template as TemplateType,
  type TemplateCategory,
  type TemplateStyle
} from "@/lib/templates";
import { Copy, Download, FileText, Loader2, Share, Sparkles, Upload } from "lucide-react";

interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  prompt?: string;
  remaining?: number | "unlimited";
  watermark?: boolean;
  error?: string;
  needsUpgrade?: boolean;
}

interface ImageGeneratorProps {
  userId?: string;
  userTier?: "free" | "pro";
  initialTemplateId?: string;
}

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const DEFAULT_FREE_REMAINING = 2;

const PLACEHOLDER_KEYS = [
  ["[PERSON]", "person"],
  ["[COUPLE]", "couple"],
  ["[PARTNER]", "partner"],
  ["[EXPRESSION]", "expression"],
  ["[POSE]", "pose"]
] as const;

export function ImageGenerator({ userId, userTier = "free", initialTemplateId }: ImageGeneratorProps) {
  const locale = useLocale();
  const t = useTranslations("generatorModule");
  const tTemplates = useTranslations("templatesPage.browser");

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const templateCount = promptTemplates.length;

  const categories = useMemo<TemplateCategory[]>(() => {
    const unique = new Set<TemplateCategory>();
    promptTemplates.forEach((template) => unique.add(template.category));
    return Array.from(unique);
  }, []);

  const stylesByCategory = useMemo(() => {
    const map = new Map<TemplateCategory, TemplateStyle[]>();
    promptTemplates.forEach((template) => {
      const current = map.get(template.category) ?? [];
      if (!current.includes(template.style)) {
        current.push(template.style);
      }
      map.set(template.category, current);
    });
    return map;
  }, []);

  const initialCategory = categories[0] ?? "portrait";
  const initialStyle = (stylesByCategory.get(initialCategory) ?? ["natural"])[0] ?? "natural";

  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState<TemplateCategory>(initialCategory);
  const [style, setStyle] = useState<TemplateStyle>(initialStyle as TemplateStyle);
  const [resolution, setResolution] = useState<"512x512" | "1024x1024">("512x512");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    const availableStyles = stylesByCategory.get(category) ?? [];
    if (availableStyles.length > 0 && !availableStyles.includes(style)) {
      setStyle(availableStyles[0]);
    }
  }, [category, style, stylesByCategory]);

  const handleUpgrade = useCallback(() => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.location.hash = "#pricing";
  }, []);

  const replaceTemplatePlaceholders = useCallback(
    (template: TemplateType) => {
      let basePrompt = template.prompt;
      for (const [placeholder, key] of PLACEHOLDER_KEYS) {
        const replacement = t(`placeholders.${key}` as const);
        basePrompt = basePrompt.replaceAll(placeholder, replacement);
      }
      return basePrompt;
    },
    [t]
  );

  const handleTemplateSelect = useCallback(
    (template: TemplateType) => {
      if (template.tier === "premium" && userTier === "free") {
        handleUpgrade();
        return;
      }

      setSelectedTemplate(template);
      setCategory(template.category);
      setStyle(template.style);
      setPrompt(replaceTemplatePlaceholders(template));
      setIsPickerOpen(false);
    },
    [handleUpgrade, replaceTemplatePlaceholders, userTier]
  );

  useEffect(() => {
    if (!initialTemplateId) {
      return;
    }

    const template = promptTemplates.find((item) => item.id === initialTemplateId);
    if (!template) {
      return;
    }

    handleTemplateSelect(template);
  }, [initialTemplateId, handleTemplateSelect]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult({ success: false, error: t("errors.invalidImageType") });
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setResult({ success: false, error: t("errors.invalidImageSize") });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setResult({ success: false, error: t("errors.promptRequired") });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageUrl: uploadedImage,
          userId,
          category,
          style,
          resolution
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || t("errors.generationFailed"),
          needsUpgrade: data.needsUpgrade
        });
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("Generation error:", error);
      setResult({ success: false, error: t("errors.network") });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, uploadedImage, userId, category, style, resolution, t]);

  const copyPrompt = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, []);

  const shareImage = useCallback(async () => {
    if (!result?.imageUrl) return;

    try {
      await navigator.share({
        title: t("results.title"),
        text: t("description", { count: numberFormatter.format(templateCount) }),
        url: result.imageUrl
      });
    } catch (error) {
      copyPrompt(result.imageUrl);
    }
  }, [copyPrompt, numberFormatter, result?.imageUrl, t, templateCount]);

  const styleOptions = stylesByCategory.get(category) ?? [];

  const remainingLabel = useMemo(() => {
    if (!result) {
      return t("form.remaining", { count: numberFormatter.format(DEFAULT_FREE_REMAINING) });
    }

    if (result.remaining === "unlimited") {
      return t("form.remainingUnlimited");
    }

    const count = numberFormatter.format(result.remaining ?? DEFAULT_FREE_REMAINING);
    return t("form.remaining", { count });
  }, [numberFormatter, result, t]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-600">
                  {t("title")}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {selectedTemplate
                    ? t("template.current", { name: selectedTemplate.name })
                    : t("template.empty")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("description", { count: numberFormatter.format(templateCount) })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPickerOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                {t("template.open")}
              </Button>
              {selectedTemplate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(null);
                    setPrompt("");
                  }}
                >
                  {t("template.clear")}
                </Button>
              )}
            </div>
          </div>

          {selectedTemplate && (
            <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 md:grid-cols-[160px,1fr]">
              <img
                src={selectedTemplate.previewUrl}
                alt={selectedTemplate.name}
                className="h-36 w-full rounded-lg object-cover"
              />
              <div className="space-y-2 text-sm text-gray-600">
                <p>{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <Badge variant="outline">
                    {tTemplates(`filters.categories.${selectedTemplate.category}`)}
                  </Badge>
                  <Badge variant="outline">
                    {tTemplates(`filters.styles.${selectedTemplate.style}`)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isPickerOpen && (
        <Card className="border border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <TemplateSelector
              onTemplateSelect={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
              userTier={userTier}
              onClose={() => setIsPickerOpen(false)}
            />
          </CardContent>
        </Card>
      )}

      {!isPickerOpen && (
        <>
          <Card className="border border-white/60 shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900">
                <span>{t("form.title")}</span>
                {userTier === "free" && <Badge variant="secondary">{remainingLabel}</Badge>}
              </CardTitle>
              <CardDescription>{t("form.description", { count: numberFormatter.format(templateCount) })}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.uploadLabel")}
                </label>
                <div className="mt-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                  {uploadedImage ? (
                    <div className="space-y-3">
                      <Image
                        src={uploadedImage}
                        alt={t("form.uploadLabel")}
                        width={240}
                        height={240}
                        className="mx-auto h-48 w-48 rounded-lg object-cover"
                      />
                      <Button variant="outline" size="sm" onClick={() => setUploadedImage(null)}>
                        {t("form.removeImage")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-gray-500">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500">
                        {t("form.uploadCta")}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="text-sm">{t("form.uploadHint")}</p>
                      <p className="text-xs text-gray-400">{t("form.uploadRequirements")}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.promptLabel")}
                </label>
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={t("form.promptPlaceholder")}
                  rows={4}
                  className="mt-2 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("form.category")}
                  </label>
                  <Select value={category} onValueChange={(value) => setCategory(value as TemplateCategory)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((option) => (
                        <SelectItem key={option} value={option}>
                          {tTemplates(`filters.categories.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("form.style")}
                  </label>
                  <Select value={style} onValueChange={(value) => setStyle(value as TemplateStyle)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {tTemplates(`filters.styles.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("form.resolution")}
                  </label>
                  <Select value={resolution} onValueChange={(value) => setResolution(value as "512x512" | "1024x1024")}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512x512">{t("form.resolutionStandard")}</SelectItem>
                      <SelectItem value="1024x1024" disabled={userTier === "free"}>
                        {t("form.resolutionPremium")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white"
                disabled={isGenerating || !prompt.trim()}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("form.generating")}
                  </>
                ) : (
                  t("form.generate")
                )}
              </Button>

              {userTier === "free" && (
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 text-center">
                  <p className="text-sm text-gray-600">{t("form.upgradeTeaser")}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={handleUpgrade}>
                    {t("form.upgradeCta")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card className="border border-white/60 shadow">
              <CardHeader>
                <CardTitle>{t("results.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {result.success && result.imageUrl ? (
                  <div className="space-y-5">
                    <div className="relative">
                      <Image
                        src={result.imageUrl}
                        alt={t("results.title")}
                        width={512}
                        height={512}
                        className="mx-auto w-full max-w-md rounded-lg shadow-lg"
                      />
                      {result.watermark && (
                        <Badge className="absolute bottom-3 right-3 bg-black/60 text-white">
                          {t("results.watermark")}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(result.imageUrl!, "_blank")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {t("results.download")}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyPrompt(result.imageUrl!)}>
                        <Copy className="mr-2 h-4 w-4" />
                        {t("results.copyLink")}
                      </Button>
                      <Button variant="outline" size="sm" onClick={shareImage}>
                        <Share className="mr-2 h-4 w-4" />
                        {t("results.share")}
                      </Button>
                    </div>

                    {result.prompt && (
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{t("results.promptTitle")}</h4>
                          <Button variant="ghost" size="sm" onClick={() => copyPrompt(result.prompt!)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">{result.prompt}</p>
                      </div>
                    )}

                    {typeof result.remaining === "number" && (
                      <p className="text-center text-sm text-gray-500">
                        {result.remaining > 0
                          ? t("results.remaining", { count: numberFormatter.format(result.remaining) })
                          : t("results.remainingZero")}
                      </p>
                    )}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription className="flex items-center justify-between gap-2">
                      <span>{result?.error}</span>
                      {result?.needsUpgrade && (
                        <Button variant="link" className="p-0 text-white" onClick={handleUpgrade}>
                          {t("results.upgradeNow")}
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
