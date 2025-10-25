// ============================================
// 텍스트 음성 변환 (TTS) API 라우트
// POST /api/tts
// ============================================

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * POST 요청 핸들러 - 텍스트를 음성으로 변환
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 바디 파싱
    const body = await request.json();
    const { text } = body;

    // 2. 입력 검증
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          error: "텍스트가 필요합니다.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    if (text.length > 4096) {
      return NextResponse.json(
        {
          error: "텍스트가 너무 깁니다. 최대 4096자까지 가능합니다.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. OpenAI TTS API 호출
    console.log(`🔊 TTS 요청: "${text.substring(0, 50)}..."`);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // 여성 목소리 (alloy, echo, fable, onyx, nova, shimmer)
      input: text,
      speed: 1.0,
    });

    // 4. 오디오 데이터를 Buffer로 변환
    const buffer = Buffer.from(await mp3.arrayBuffer());

    console.log(`✅ TTS 생성 완료 (${buffer.length} bytes)`);

    // 5. 오디오 응답 반환
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("❌ TTS 에러:", error);

    return NextResponse.json(
      {
        error: "음성 변환 중 오류가 발생했습니다.",
        message: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

