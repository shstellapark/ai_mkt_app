"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export function GenerateButton({
  onClick,
  isLoading,
  disabled = false,
  disabledReason,
}: GenerateButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <div className="space-y-2">
      <Button
        onClick={onClick}
        disabled={isDisabled}
        size="lg"
        className="w-full text-lg py-6 font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            마케팅 문구 생성 중...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            마케팅 문구 생성하기
          </>
        )}
      </Button>

      {disabledReason && !isLoading && (
        <p className="text-sm text-red-500 text-center">{disabledReason}</p>
      )}
    </div>
  );
}

