"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Copy, FileJson, AlertCircle, Volume2, VolumeX, Loader2, Download } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import type { GeneratedCopy, GenerateResponse, ErrorResponse } from "@/types";

interface ResultViewerProps {
  result: GenerateResponse | ErrorResponse | null;
  onClear?: () => void;
}

export function ResultViewer({ result, onClear }: ResultViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12">
          <div className="text-center space-y-2">
            <div className="text-gray-400 text-6xl mb-4">✨</div>
            <p className="text-gray-600 font-medium">생성된 문구가 여기에 표시됩니다</p>
            <p className="text-sm text-gray-500">
              옵션을 설정하고 &quot;마케팅 문구 생성하기&quot; 버튼을 클릭하세요
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 처리
  if (result.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">{result.message}</p>
            {result.code && (
              <p className="text-sm opacity-80">에러 코드: {result.code}</p>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // 성공 응답
  const successResult = result as GenerateResponse;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("클립보드에 복사되었습니다!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = successResult.generated_copies
      .map((copy) => `[${copy.platform}]\n${copy.text}`)
      .join("\n\n");
    navigator.clipboard.writeText(allText);
    setCopiedIndex(-1);
    toast.success("모든 문구가 클립보드에 복사되었습니다!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 텍스트 파일로 내보내기
  const handleExportTxt = () => {
    const content = successResult.generated_copies
      .map((copy) => `[${copy.platform}]\n${copy.text}\n`)
      .join("\n---\n\n");
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-copies-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("TXT 파일로 내보내기 완료!");
  };

  // JSON 파일로 내보내기
  const handleExportJson = () => {
    const content = JSON.stringify(successResult, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-copies-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON 파일로 내보내기 완료!");
  };

  const handlePlayTTS = async (text: string, index: number) => {
    // 이미 재생 중이면 정지
    if (playingIndex === index && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingIndex(null);
      return;
    }

    // 다른 오디오가 재생 중이면 정지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      setLoadingIndex(index);
      toast.loading("음성을 생성하고 있습니다...", { id: "tts-loading" });

      // TTS API 호출
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      toast.dismiss("tts-loading");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "음성 변환에 실패했습니다.");
      }

      // 오디오 Blob 생성
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // 오디오 재생
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => {
        setPlayingIndex(index);
        setLoadingIndex(null);
      };

      audio.onended = () => {
        setPlayingIndex(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setPlayingIndex(null);
        setLoadingIndex(null);
        toast.error("오디오 재생에 실패했습니다.");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error("TTS 에러:", error);
      setLoadingIndex(null);
      toast.error(error instanceof Error ? error.message : "음성 변환에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-900">생성 완료!</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportTxt}>
                <Download className="w-4 h-4 mr-1" />
                TXT
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJson}>
                <FileJson className="w-4 h-4 mr-1" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                {copiedIndex === -1 ? (
                  <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                전체 복사
              </Button>
              {onClear && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                  초기화
                </Button>
              )}
            </div>
          </div>
          {successResult.metadata && (
            <CardDescription className="text-green-800">
              생성 시각:{" "}
              {new Date(successResult.metadata.generatedAt).toLocaleString("ko-KR")}
              {" · "}
              모델: {successResult.metadata.model}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {/* 생성된 문구들 */}
      <div className="space-y-3">
        {successResult.generated_copies.map((copy: GeneratedCopy, index: number) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="pt-6 space-y-4">
              {/* 플랫폼 헤더 */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {copy.platform}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlayTTS(copy.text, index)}
                    disabled={loadingIndex === index}
                    className="relative"
                  >
                    {loadingIndex === index ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        로딩...
                      </>
                    ) : playingIndex === index ? (
                      <>
                        <VolumeX className="w-4 h-4 mr-1 text-blue-600" />
                        정지
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-1" />
                        듣기
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(copy.text, index)}
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        복사
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 문구 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {copy.text}
                </p>
              </div>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>길이: {copy.text.length}자</span>
                <span>
                  {copy.text.includes("#") && "해시태그 포함 · "}
                  {/[\u{1F300}-\u{1F9FF}]/u.test(copy.text) && "이모지 포함"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* JSON 보기 */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJson(!showJson)}
            className="w-full"
          >
            <FileJson className="w-4 h-4 mr-2" />
            {showJson ? "JSON 숨기기" : "JSON 응답 보기"}
          </Button>

          {showJson && (
            <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto text-xs">
              {JSON.stringify(successResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

