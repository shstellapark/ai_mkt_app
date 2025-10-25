// ============================================
// OpenAI API 클라이언트 설정
// ============================================

import OpenAI from "openai";

/**
 * OpenAI 클라이언트 인스턴스
 * 환경 변수에서 API 키를 가져옵니다.
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * OpenAI 모델 설정
 */
export const OPENAI_CONFIG = {
  model: process.env.OPENAI_MODEL || "gpt-4o",
  temperature: 0.8, // 창의성과 일관성의 균형 (0.7~0.9)
  maxTokens: 500, // 응답 최대 토큰 수
} as const;

/**
 * API 키 검증
 */
export function validateApiKey(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY가 환경 변수에 설정되지 않았습니다.");
    return false;
  }
  
  if (!apiKey.startsWith("sk-")) {
    console.error("❌ OPENAI_API_KEY 형식이 올바르지 않습니다.");
    return false;
  }
  
  return true;
}

/**
 * OpenAI API 호출 에러 타입
 */
export interface OpenAIError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * OpenAI API 호출 래퍼 함수
 * 에러 핸들링 및 로깅 포함
 */
export async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  temperature?: number
): Promise<string> {
  try {
    // API 키 검증
    if (!validateApiKey()) {
      throw new Error("OpenAI API 키가 설정되지 않았습니다.");
    }

    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: temperature || OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.maxTokens,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("OpenAI로부터 응답을 받지 못했습니다.");
    }

    // 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log("✅ OpenAI 응답 받음:", {
        model: completion.model,
        tokens: completion.usage?.total_tokens,
      });
    }

    return response.trim();
  } catch (error: unknown) {
    // 에러 타입 처리
    if (error instanceof OpenAI.APIError) {
      console.error("❌ OpenAI API 에러:", {
        status: error.status,
        message: error.message,
        code: error.code,
      });

      // 사용자 친화적 에러 메시지
      if (error.status === 401) {
        throw new Error("OpenAI API 키가 유효하지 않습니다.");
      } else if (error.status === 429) {
        throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
      } else if (error.status === 500) {
        throw new Error("OpenAI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }

      throw new Error(`OpenAI API 오류: ${error.message}`);
    }

    // 일반 에러
    if (error instanceof Error) {
      console.error("❌ 에러 발생:", error.message);
      throw error;
    }

    // 알 수 없는 에러
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
}

/**
 * JSON 형식으로 응답을 요청하는 OpenAI 호출
 * 구조화된 데이터가 필요할 때 사용
 */
export async function callOpenAIWithJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  temperature?: number
): Promise<T> {
  try {
    const response = await callOpenAI(
      systemPrompt + "\n\n응답은 반드시 유효한 JSON 형식으로만 제공하세요.",
      userPrompt,
      temperature
    );

    // JSON 파싱
    try {
      // 코드 블록 제거 (```json ... ``` 형태)
      let jsonString = response;
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      } else {
        // ``` 만 있는 경우
        const codeMatch = response.match(/```\n?([\s\S]*?)\n?```/);
        if (codeMatch) {
          jsonString = codeMatch[1];
        }
      }

      return JSON.parse(jsonString.trim()) as T;
    } catch (parseError) {
      console.error("❌ JSON 파싱 실패:", response);
      throw new Error("OpenAI 응답을 JSON으로 변환할 수 없습니다.");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * 스트리밍 응답 (향후 확장용)
 */
export async function callOpenAIStream(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    if (!validateApiKey()) {
      throw new Error("OpenAI API 키가 설정되지 않았습니다.");
    }

    const stream = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error("❌ 스트리밍 에러:", error);
    throw error;
  }
}


