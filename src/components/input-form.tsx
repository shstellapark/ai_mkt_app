"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

// 다양한 예제 목록
const EXAMPLE_VALUES = [
  "바르기 쉽고 자외선 차단력이 강한 선크림",
  "유기농 원료로 만든 저자극 스킨케어",
  "하루 10분 투자로 영어 실력을 키우는 온라인 강의",
  "집에서 즐기는 미슐랭 셰프의 레시피 키트",
  "반려동물을 위한 천연 재료 수제 간식",
  "업무 효율을 2배로 높여주는 AI 업무 자동화 툴",
  "초보자도 쉽게 시작하는 홈트레이닝 프로그램",
  "아이들의 창의력을 키우는 코딩 교육 완구",
  "바쁜 직장인을 위한 5분 완성 간편 식사",
  "수면의 질을 개선하는 스마트 베개",
  "환경을 생각하는 제로웨이스트 생활용품",
  "피부 타입별 맞춤 화장품 추천 서비스",
];

interface InputFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function InputForm({ value, onChange, error }: InputFormProps) {
  const [charCount, setCharCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  // 컴포넌트 마운트 시 랜덤 예제 선택
  const randomExample = useMemo(() => {
    return EXAMPLE_VALUES[Math.floor(Math.random() * EXAMPLE_VALUES.length)];
  }, []);

  useEffect(() => {
    setCharCount(value.length);
    setShowWarning(value.length > 0 && value.length < 10);
  }, [value]);

  const isValid = charCount >= 10 && charCount <= 200;
  const isTooLong = charCount > 200;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="valueProposition" className="text-base font-semibold">
          가치 제언 <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-gray-600">
          제품이나 서비스의 핵심 가치를 명확하게 설명해주세요
        </p>
      </div>

      <div className="space-y-2">
        <Textarea
          id="valueProposition"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`예: ${randomExample}`}
          className={`min-h-[120px] resize-none ${
            error || isTooLong
              ? "border-red-500 focus-visible:ring-red-500"
              : isValid
              ? "border-green-500 focus-visible:ring-green-500"
              : ""
          }`}
          maxLength={250}
        />

        {/* 글자 수 카운터 */}
        <div className="flex items-center justify-between text-sm">
          <div
            className={`font-medium ${
              isTooLong
                ? "text-red-600"
                : isValid
                ? "text-green-600"
                : showWarning
                ? "text-amber-600"
                : "text-gray-500"
            }`}
          >
            {charCount}자 / 200자
            {isValid && " ✓"}
            {showWarning && " (최소 10자 필요)"}
            {isTooLong && " (최대 200자 초과)"}
          </div>

          {/* 진행 상태 표시 */}
          {charCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isTooLong
                      ? "bg-red-500"
                      : isValid
                      ? "bg-green-500"
                      : "bg-amber-500"
                  }`}
                  style={{
                    width: `${Math.min((charCount / 200) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 경고/에러 메시지 */}
      {showWarning && !error && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            가치 제언은 최소 10자 이상 입력해주세요. 현재 {charCount}자입니다.
          </AlertDescription>
        </Alert>
      )}

      {isTooLong && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            가치 제언은 최대 200자까지 입력할 수 있습니다. 현재 {charCount}자입니다.
          </AlertDescription>
        </Alert>
      )}

      {error && !isTooLong && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 도움말 */}
      {!showWarning && !error && !isTooLong && charCount === 0 && (
        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">💡 작성 팁:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>제품/서비스의 핵심 특징을 간결하게 설명하세요</li>
            <li>타겟 고객이 얻을 수 있는 혜택을 포함하세요</li>
            <li>구체적이고 명확한 표현을 사용하세요</li>
          </ul>
        </div>
      )}
    </div>
  );
}

