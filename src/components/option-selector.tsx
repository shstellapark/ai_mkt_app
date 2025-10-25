"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { useState } from "react";
import type { 
  FormData,
  Platform,
  Gender,
  AgeRange,
  MarketingPurpose,
  ToneStyle,
  Language,
} from "@/types";
import {
  GENDER_OPTIONS,
  AGE_RANGE_OPTIONS,
  PLATFORM_OPTIONS,
  MARKETING_PURPOSE_OPTIONS,
  TONE_STYLE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types";

interface OptionSelectorProps {
  formData: Omit<FormData, "valueProposition">;
  onChange: (field: keyof Omit<FormData, "valueProposition">, value: unknown) => void;
}

export function OptionSelector({ formData, onChange }: OptionSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const newPlatforms = checked
      ? [...formData.platforms, platform as Platform]
      : formData.platforms.filter((p) => p !== platform);
    onChange("platforms", newPlatforms);
  };

  return (
    <div className="space-y-6">
      {/* 기본 타겟 옵션 */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">타겟 설정</Label>
            <p className="text-sm text-gray-600">마케팅 대상의 기본 정보를 선택하세요</p>
          </div>

          {/* 성별 */}
          <div className="space-y-3">
            <Label htmlFor="gender">성별</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => onChange("gender", value as Gender)}
              className="flex gap-4"
            >
              {GENDER_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                  <Label
                    htmlFor={`gender-${option.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 연령대 */}
          <div className="space-y-3">
            <Label htmlFor="ageRange">연령대</Label>
            <Select value={formData.ageRange} onValueChange={(value) => onChange("ageRange", value as AgeRange)}>
              <SelectTrigger>
                <SelectValue placeholder="연령대를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {AGE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 플랫폼 및 마케팅 설정 */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">마케팅 설정</Label>
            <p className="text-sm text-gray-600">문구를 사용할 플랫폼과 목적을 선택하세요</p>
          </div>

          {/* 플랫폼 */}
          <div className="space-y-3">
            <Label>
              플랫폼 <span className="text-red-500">*</span>
              <span className="text-sm font-normal text-gray-500 ml-2">
                (최소 1개, 최대 5개)
              </span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {PLATFORM_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={`platform-${option.value}`}
                    checked={formData.platforms.includes(option.value as Platform)}
                    onCheckedChange={(checked) =>
                      handlePlatformChange(option.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`platform-${option.value}`}
                    className="font-normal cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {formData.platforms.length === 0 && (
              <p className="text-sm text-red-500">최소 1개 이상의 플랫폼을 선택해주세요</p>
            )}
          </div>

          {/* 마케팅 목적 */}
          <div className="space-y-3">
            <Label htmlFor="purpose">마케팅 목적</Label>
            <Select value={formData.purpose} onValueChange={(value) => onChange("purpose", value as MarketingPurpose)}>
              <SelectTrigger>
                <SelectValue placeholder="마케팅 목적을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {MARKETING_PURPOSE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 어조 스타일 */}
          <div className="space-y-3">
            <Label htmlFor="tone">어조 스타일</Label>
            <Select value={formData.tone} onValueChange={(value) => onChange("tone", value as ToneStyle)}>
              <SelectTrigger>
                <SelectValue placeholder="어조 스타일을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {TONE_STYLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 생성 분량 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="outputCount">생성 분량</Label>
              <span className="text-sm font-medium">{formData.outputCount}개</span>
            </div>
            <Slider
              id="outputCount"
              min={1}
              max={5}
              step={1}
              value={[formData.outputCount]}
              onValueChange={(value) => onChange("outputCount", value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1개</span>
              <span>5개</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 고급 옵션 */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <Card>
          <CardContent className="pt-6">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-gray-600" />
                <span className="text-base font-semibold">고급 옵션</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              )}
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-6 mt-6">
              {/* 언어 선택 */}
              <div className="space-y-3">
                <Label htmlFor="language">언어</Label>
                <Select value={formData.language} onValueChange={(value) => onChange("language", value as Language)}>
                  <SelectTrigger>
                    <SelectValue placeholder="언어를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 톤 강도 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="toneIntensity">톤 강도</Label>
                  <span className="text-sm font-medium">
                    {formData.toneIntensity === 1 && "매우 부드럽게"}
                    {formData.toneIntensity === 2 && "부드럽게"}
                    {formData.toneIntensity === 3 && "보통"}
                    {formData.toneIntensity === 4 && "강렬하게"}
                    {formData.toneIntensity === 5 && "매우 강렬하게"}
                  </span>
                </div>
                <Slider
                  id="toneIntensity"
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.toneIntensity]}
                  onValueChange={(value) => onChange("toneIntensity", value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>부드럽게</span>
                  <span>강렬하게</span>
                </div>
              </div>

              {/* 해시태그 포함 */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="includeHashtags" className="cursor-pointer">
                    해시태그 포함
                  </Label>
                  <p className="text-sm text-gray-600">
                    SNS용 해시태그를 자동으로 생성합니다
                  </p>
                </div>
                <Switch
                  id="includeHashtags"
                  checked={formData.includeHashtags}
                  onCheckedChange={(checked) => onChange("includeHashtags", checked)}
                />
              </div>

              {/* 이모지 포함 */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="includeEmojis" className="cursor-pointer">
                    이모지 포함
                  </Label>
                  <p className="text-sm text-gray-600">
                    감정 표현용 이모지를 자동으로 포함합니다
                  </p>
                </div>
                <Switch
                  id="includeEmojis"
                  checked={formData.includeEmojis}
                  onCheckedChange={(checked) => onChange("includeEmojis", checked)}
                />
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </div>
  );
}

