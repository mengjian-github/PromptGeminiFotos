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
import { trackEvent } from "@/lib/analytics";
import { Copy, Download, ExternalLink, FileText, Sparkles, Upload } from "lucide-react";

interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  prompt?: string;
  remaining?: number | "unlimited";
  error?: string;
  needsUpgrade?: boolean;
}

interface ImageGeneratorProps {
  userId?: string;
  userTier?: "free" | "pro";
  initialTemplateId?: string;
  initialPrompt?: string;
  initialPromptMeta?: {
    source?: string;
    scenario?: string;
    templateId?: string;
  };
}

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const DEFAULT_FREE_REMAINING = 2;
const GEMINI_URL = "https://gemini.google.com/app";

const PLACEHOLDER_KEYS = [
  ["[PERSON]", "person"],
  ["[COUPLE]", "couple"],
  ["[PARTNER]", "partner"],
  ["[EXPRESSION]", "expression"],
  ["[POSE]", "pose"]
] as const;

export function ImageGenerator({ userId, userTier = "free", initialTemplateId, initialPrompt, initialPromptMeta }: ImageGeneratorProps) {
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
      trackEvent('template_select', { template_id: template.id, category: template.category, style: template.style, tier: template.tier });
      setSelectedTemplate(template);
      setCategory(template.category);
      setStyle(template.style);
      setPrompt(replaceTemplatePlaceholders(template));
      setIsPickerOpen(false);
    },
    [replaceTemplatePlaceholders]
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

  useEffect(() => {
    if (!initialPrompt?.trim()) {
      return;
    }

    setPrompt(initialPrompt);
    trackEvent('generator_prefill', {
      source: initialPromptMeta?.source ?? 'unknown',
      scenario: initialPromptMeta?.scenario,
      template_id: initialPromptMeta?.templateId,
      prompt_length: initialPrompt.length,
    });
  }, [initialPrompt, initialPromptMeta?.scenario, initialPromptMeta?.source, initialPromptMeta?.templateId]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    trackEvent('image_upload_start', { file_type: file.type, file_size: file.size });

    if (!file.type.startsWith("image/")) {
      trackEvent('image_upload_error', { reason: 'invalid_type', file_type: file.type });
      setResult({ success: false, error: t("errors.invalidImageType") });
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      trackEvent('image_upload_error', { reason: 'oversized', file_size: file.size });
      setResult({ success: false, error: t("errors.invalidImageSize") });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      trackEvent('image_upload_success', { file_type: file.type, file_size: file.size });
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      trackEvent('generate_error', { reason: 'empty_prompt' });
      setResult({ success: false, error: t("errors.promptRequired") });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    trackEvent('generator_start', {
      has_upload: !!uploadedImage,
      category,
      style,
      resolution,
      tier: userTier,
      prompt_length: prompt.trim().length,
    });

    // Simulate async generation so the UI state and events mirror real behavior
    const startTime = Date.now();
    setTimeout(() => {
      const optimizedPrompt = [
        prompt.trim(),
        `Category: ${category}`,
        `Style: ${style}`,
        `Target resolution: ${resolution}`,
        uploadedImage ? "Use the uploaded image as the identity/reference photo." : "No reference image provided."
      ].join("\n");

      trackEvent('generate_complete', {
        has_upload: !!uploadedImage,
        category,
        style,
        resolution,
        tier: userTier,
        prompt_length: prompt.trim().length,
        duration_ms: Date.now() - startTime,
      });

      setResult({
        success: true,
        prompt: optimizedPrompt,
        remaining: DEFAULT_FREE_REMAINING
      });
      setIsGenerating(false);
    }, 800);
  }, [prompt, uploadedImage, category, style, resolution, t, userTier]);

  const copyPrompt = useCallback(async (text: string) => {
    trackEvent('prompt_copy', { source: 'generator_result', prompt_length: text.length, has_upload: !!uploadedImage });

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [uploadedImage]);

  const downloadPrompt = useCallback(() => {
    if (!result?.prompt) return;
    const blob = new Blob([result.prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "prompt-gemini-fotos.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    trackEvent('download_click', { source: 'generator_result', file_type: 'txt', has_upload: !!uploadedImage });
  }, [result?.prompt, uploadedImage]);

  const openGemini = useCallback(() => {
    trackEvent('gemini_outbound_click', {
      source: 'generator_result',
      destination: GEMINI_URL,
      has_upload: !!uploadedImage,
      category,
      style,
    });
  }, [category, style, uploadedImage]);

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
              <Button variant="outline" size="sm" onClick={() => { trackEvent('template_open', { source: 'generator_picker' }); setIsPickerOpen(true); }}>
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
                      <SelectItem value="1024x1024">
                        {t("form.resolutionPremium")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white"
                disabled={!prompt.trim() || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? t("form.generating") : t("form.generate")}
              </Button>

              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 text-center">
                <p className="text-sm text-gray-600">{t("form.upgradeTeaser")}</p>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="border border-white/60 shadow">
              <CardHeader>
                <CardTitle>{t("results.promptTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                {result.success && result.prompt ? (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{t("results.promptTitle")}</h4>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => copyPrompt(result.prompt!)}>
                          <Copy className="h-4 w-4" />
                          {locale === "pt-BR" ? "Copiar" : "Copy"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadPrompt}>
                          <Download className="h-4 w-4" />
                          TXT
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={GEMINI_URL} target="_blank" rel="noopener noreferrer" onClick={openGemini}>
                            <ExternalLink className="h-4 w-4" />
                            Gemini
                          </a>
                        </Button>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-600">{result.prompt}</pre>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>{result?.error}</AlertDescription>
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
