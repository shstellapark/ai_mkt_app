"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { InputForm } from "@/components/input-form";
import { OptionSelector } from "@/components/option-selector";
import { GenerateButton } from "@/components/generate-button";
import { ResultViewer } from "@/components/result-viewer";
import { ThemeToggle } from "@/components/theme-toggle";
import { HistoryManager } from "@/components/history-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { FormData, GenerateResponse, ErrorResponse, HistoryItem } from "@/types";
import { DEFAULT_FORM_DATA } from "@/types";

export default function Home() {
  const [valueProposition, setValueProposition] = useState("");
  const [formData, setFormData] = useState<Omit<FormData, "valueProposition">>(
    {
      gender: DEFAULT_FORM_DATA.gender,
      ageRange: DEFAULT_FORM_DATA.ageRange,
      platforms: DEFAULT_FORM_DATA.platforms,
      purpose: DEFAULT_FORM_DATA.purpose,
      tone: DEFAULT_FORM_DATA.tone,
      outputCount: DEFAULT_FORM_DATA.outputCount,
      language: DEFAULT_FORM_DATA.language,
      toneIntensity: DEFAULT_FORM_DATA.toneIntensity,
      includeHashtags: DEFAULT_FORM_DATA.includeHashtags,
      includeEmojis: DEFAULT_FORM_DATA.includeEmojis,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | ErrorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    const savedValue = localStorage.getItem("valueProposition");
    const savedFormData = localStorage.getItem("formData");

    if (savedValue) {
      setValueProposition(savedValue);
    }
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(parsed);
      } catch {
        console.error("Failed to parse saved form data");
      }
    }
  }, []);

  // 입력값 변경 시 localStorage에 저장
  useEffect(() => {
    if (valueProposition) {
      localStorage.setItem("valueProposition", valueProposition);
    }
  }, [valueProposition]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleOptionChange = (
    field: keyof Omit<FormData, "valueProposition">,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    // 입력 검증
    if (valueProposition.length < 10) {
      toast.error("가치 제언은 최소 10자 이상 입력해주세요.");
      setError("가치 제언은 최소 10자 이상 입력해주세요.");
      return;
    }

    if (valueProposition.length > 200) {
      toast.error("가치 제언은 최대 200자까지 입력할 수 있습니다.");
      setError("가치 제언은 최대 200자까지 입력할 수 있습니다.");
      return;
    }

    if (formData.platforms.length === 0) {
      toast.error("최소 1개 이상의 플랫폼을 선택해주세요.");
      setError("최소 1개 이상의 플랫폼을 선택해주세요.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult(null);

    toast.loading("마케팅 문구를 생성하고 있습니다...", { id: "generating" });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valueProposition,
          ...formData,
        }),
      });

      const data = await response.json();
      setResult(data);

      toast.dismiss("generating");

      // 성공 시 결과로 스크롤 및 토스트
      if (data.status === "success") {
        toast.success("마케팅 문구가 성공적으로 생성되었습니다!", {
          description: `${data.generated_copies.length}개의 문구가 생성되었습니다.`,
        });

        // 히스토리에 저장
        saveToHistory(data as GenerateResponse);
        
        setTimeout(() => {
          const resultElement = document.getElementById("result-section");
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        toast.error("문구 생성에 실패했습니다", {
          description: data.message,
        });
      }
    } catch {
      toast.dismiss("generating");
      toast.error("서버와 통신 중 오류가 발생했습니다");
      
      setResult({
        status: "error",
        message: "서버와 통신 중 오류가 발생했습니다.",
        code: "NETWORK_ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  // 히스토리에 저장
  const saveToHistory = (response: GenerateResponse) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      valueProposition,
      formData,
      result: response,
      isFavorite: false,
    };

    const existingHistory = localStorage.getItem("generationHistory");
    const history: HistoryItem[] = existingHistory
      ? JSON.parse(existingHistory)
      : [];
    
    // 최대 50개까지만 저장
    const updatedHistory = [historyItem, ...history].slice(0, 50);
    localStorage.setItem("generationHistory", JSON.stringify(updatedHistory));
  };

  // 히스토리 불러오기
  const handleLoadHistory = (item: HistoryItem) => {
    setValueProposition(item.valueProposition);
    setFormData(item.formData);
    setResult(item.result);
    toast.success("히스토리를 불러왔습니다!");
  };

  const getDisabledReason = (): string | undefined => {
    if (valueProposition.length < 10) {
      return "가치 제언을 10자 이상 입력해주세요";
    }
    if (valueProposition.length > 200) {
      return "가치 제언이 너무 깁니다 (최대 200자)";
    }
    if (formData.platforms.length === 0) {
      return "최소 1개 이상의 플랫폼을 선택해주세요";
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI 마케팅 문구 생성기
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  OpenAI 기반 타겟 맞춤형 마케팅 카피 생성
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HistoryManager onLoadHistory={handleLoadHistory} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 소개 */}
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 animate-fade-in-up">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  제품의 가치를 전달하는 완벽한 문구를 만들어보세요
                </h2>
                <p className="text-purple-100">
                  타겟 고객과 플랫폼에 최적화된 마케팅 문구를 AI가 자동으로 생성합니다
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 입력 영역 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 왼쪽: 입력 폼 */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <InputForm
                    value={valueProposition}
                    onChange={setValueProposition}
                    error={error || undefined}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽: 옵션 선택 */}
            <div className="space-y-6">
              <OptionSelector formData={formData} onChange={handleOptionChange} />
            </div>
          </div>

          {/* 생성 버튼 */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <GenerateButton
                onClick={handleGenerate}
                isLoading={isLoading}
                disabled={!!getDisabledReason()}
                disabledReason={getDisabledReason()}
              />
            </div>
          </div>

          {/* 결과 영역 */}
          <div id="result-section">
            <ResultViewer result={result} onClear={handleClear} />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Powered by{" "}
              <span className="font-semibold text-purple-600">OpenAI GPT-4</span> ·
              Built with{" "}
              <span className="font-semibold text-blue-600">Next.js 15</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              © 2025 AI 마케팅 문구 생성기. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
