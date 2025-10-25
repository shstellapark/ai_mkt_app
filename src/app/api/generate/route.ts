// ============================================
// 마케팅 문구 생성 API 라우트
// POST /api/generate
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { validateGenerateRequest, type GenerateRequestInput } from "@/lib/validation";
import { generateMultiPlatformPrompt, generatePrompt } from "@/lib/prompts";
import { callOpenAI, callOpenAIWithJSON } from "@/lib/openai";
import type { GeneratedCopy, GenerateResponse, ErrorResponse, Platform } from "@/types";

/**
 * CORS 헤더 설정
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * OPTIONS 요청 처리 (CORS preflight)
 */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * POST 요청 핸들러 - 마케팅 문구 생성
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. 요청 바디 파싱
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ErrorResponse>(
        {
          status: "error",
          message: "요청 바디를 파싱할 수 없습니다. 유효한 JSON 형식인지 확인해주세요.",
          code: "INVALID_JSON",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. 입력 검증
    const validation = validateGenerateRequest(body);

    if (!validation.success) {
      console.error("❌ 입력 검증 실패:", validation.errors);
      return NextResponse.json<ErrorResponse>(
        {
          status: "error",
          message: validation.errors?.join(", ") || "입력 데이터가 유효하지 않습니다.",
          code: "VALIDATION_ERROR",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const validatedData = validation.data!;

    // 로깅 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      console.log("✅ 입력 검증 성공");
      console.log("📝 요청 데이터:", {
        valueProposition: validatedData.valueProposition.substring(0, 30) + "...",
        platforms: validatedData.platforms,
        outputCount: validatedData.outputCount,
        target: `${validatedData.gender}, ${validatedData.ageRange}`,
      });
    }

    // 3. 마케팅 문구 생성
    let generatedCopies: GeneratedCopy[];

    if (validatedData.platforms.length === 1) {
      // 단일 플랫폼: 간단한 방식
      generatedCopies = await generateSinglePlatform(validatedData);
    } else {
      // 다중 플랫폼: JSON 형식으로 일괄 생성
      generatedCopies = await generateMultiplePlatforms(validatedData);
    }

    // 4. 성공 응답
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ 문구 생성 완료 (${generatedCopies.length}개, 소요 시간: ${duration}ms)`);

    const response: GenerateResponse = {
      status: "success",
      generated_copies: generatedCopies,
      metadata: {
        model: process.env.OPENAI_MODEL || "gpt-4o",
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: unknown) {
    // 5. 에러 처리
    console.error("❌ API 에러:", error);

    // OpenAI API 에러
    if (error instanceof Error) {
      if (error.message.includes("API 키")) {
        return NextResponse.json<ErrorResponse>(
          {
            status: "error",
            message: "OpenAI API 키가 유효하지 않습니다. 서버 설정을 확인해주세요.",
            code: "INVALID_API_KEY",
          },
          { status: 500, headers: corsHeaders }
        );
      }

      if (error.message.includes("요청 한도")) {
        return NextResponse.json<ErrorResponse>(
          {
            status: "error",
            message: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
            code: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429, headers: corsHeaders }
        );
      }

      // 일반 에러
      return NextResponse.json<ErrorResponse>(
        {
          status: "error",
          message: error.message || "문구 생성 중 오류가 발생했습니다.",
          code: "GENERATION_ERROR",
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // 알 수 없는 에러
    return NextResponse.json<ErrorResponse>(
      {
        status: "error",
        message: "서버 내부 오류가 발생했습니다.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * 단일 플랫폼 문구 생성
 */
async function generateSinglePlatform(data: GenerateRequestInput): Promise<GeneratedCopy[]> {
  const platform = data.platforms[0];
  const outputCount = data.outputCount || 1;

  const { systemPrompt, userPrompt } = generatePrompt({
    valueProposition: data.valueProposition,
    gender: data.gender,
    ageRange: data.ageRange,
    platform: platform,
    purpose: data.purpose,
    tone: data.tone,
    language: data.language,
    includeEmojis: data.includeEmojis,
    includeHashtags: data.includeHashtags,
    toneIntensity: data.toneIntensity,
  });

  // outputCount만큼 생성 (JSON 배열 형식으로 요청)
  if (outputCount === 1) {
    const text = await callOpenAI(systemPrompt, userPrompt);
    return [
      {
        platform: platform,
        text: text,
      },
    ];
  } else {
    // 여러 개 생성 시 JSON 형식으로 요청
    const updatedUserPrompt = `${userPrompt}\n\n【중요】정확히 ${outputCount}개의 서로 다른 마케팅 문구를 생성해주세요.\n\n다음 JSON 형식으로만 응답하세요:\n[\n  {"text": "첫 번째 문구"},\n  {"text": "두 번째 문구"}\n]\n\n필수 조건:\n- 정확히 ${outputCount}개만 생성 (${outputCount}개보다 많거나 적으면 안 됨)\n- 각 문구는 서로 다른 접근 방식과 표현 사용\n- 배열의 요소 개수가 정확히 ${outputCount}개인지 확인`;
    
    const result = await callOpenAIWithJSON<{ text: string }[]>(
      systemPrompt,
      updatedUserPrompt
    );

    if (result && Array.isArray(result) && result.length > 0) {
      // 요청한 개수만큼만 반환 (초과분 제거)
      const limitedResult = result.slice(0, outputCount);
      
      if (result.length !== outputCount) {
        console.warn(`⚠️  요청: ${outputCount}개, 응답: ${result.length}개 → ${limitedResult.length}개로 제한`);
      }
      
      return limitedResult.map((item) => ({
        platform: platform,
        text: item.text,
      }));
    } else {
      // JSON 파싱 실패 시 폴백
      const text = await callOpenAI(systemPrompt, userPrompt);
      return [
        {
          platform: platform,
          text: text,
        },
      ];
    }
  }
}

/**
 * 다중 플랫폼 문구 생성
 */
async function generateMultiplePlatforms(data: GenerateRequestInput): Promise<GeneratedCopy[]> {
  const outputCount = data.outputCount || 1;
  
  // outputCount가 1보다 크면 각 플랫폼별로 개별 생성
  if (outputCount > 1) {
    const copies: GeneratedCopy[] = [];
    for (const platform of data.platforms) {
      const platformCopies = await generateSinglePlatform({
        ...data,
        platforms: [platform],
      });
      copies.push(...platformCopies);
    }
    return copies;
  }

  // outputCount가 1이면 기존 방식대로 일괄 생성
  const { systemPrompt, userPrompt } = generateMultiPlatformPrompt(
    {
      valueProposition: data.valueProposition,
      gender: data.gender,
      ageRange: data.ageRange,
      purpose: data.purpose,
      tone: data.tone,
      language: data.language,
      includeEmojis: data.includeEmojis,
      includeHashtags: data.includeHashtags,
      toneIntensity: data.toneIntensity,
    },
    data.platforms
  );

  try {
    // JSON 형식으로 응답 받기
    const response = await callOpenAIWithJSON<{
      copies: Array<{ platform: Platform; text: string }>;
    }>(systemPrompt, userPrompt);

    // 응답 검증
    if (!response.copies || !Array.isArray(response.copies)) {
      throw new Error("OpenAI 응답 형식이 올바르지 않습니다.");
    }

    // 요청한 플랫폼 개수와 응답 개수 확인
    if (response.copies.length !== data.platforms.length) {
      console.warn(
        `⚠️  요청 플랫폼 ${data.platforms.length}개, 응답 ${response.copies.length}개`
      );
    }

    return response.copies;
  } catch {
    console.error("❌ JSON 파싱 실패, 폴백: 개별 생성");
    
    // 폴백: 각 플랫폼별로 개별 생성
    const copies: GeneratedCopy[] = [];
    for (const platform of data.platforms) {
      const platformCopies = await generateSinglePlatform({
        ...data,
        platforms: [platform],
      });
      copies.push(...platformCopies);
    }
    
    return copies;
  }
}

/**
 * 에러 응답 헬퍼
 */
function createErrorResponse(
  message: string,
  code: string,
  status: number
): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    {
      status: "error",
      message,
      code,
    },
    { status, headers: corsHeaders }
  );
}

