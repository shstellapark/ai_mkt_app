// ============================================
// API 입력 검증 스키마 (Zod)
// ============================================

import { z } from "zod";
import {
  PLATFORMS,
  GENDERS,
  AGE_RANGES,
  MARKETING_PURPOSES,
  TONE_STYLES,
  LANGUAGES,
} from "@/types";

/**
 * 플랫폼 검증 스키마
 */
const platformSchema = z.enum([
  PLATFORMS.INSTAGRAM,
  PLATFORMS.YOUTUBE,
  PLATFORMS.FACEBOOK,
  PLATFORMS.TIKTOK,
  PLATFORMS.BLOG,
] as const);

/**
 * 성별 검증 스키마
 */
const genderSchema = z.enum([
  GENDERS.MALE,
  GENDERS.FEMALE,
  GENDERS.ALL,
] as const);

/**
 * 연령대 검증 스키마
 */
const ageRangeSchema = z.enum([
  AGE_RANGES.TEENS,
  AGE_RANGES.TWENTIES,
  AGE_RANGES.THIRTIES,
  AGE_RANGES.FORTIES,
  AGE_RANGES.FIFTIES_PLUS,
] as const);

/**
 * 마케팅 목적 검증 스키마
 */
const marketingPurposeSchema = z.enum([
  MARKETING_PURPOSES.BRAND_AWARENESS,
  MARKETING_PURPOSES.PURCHASE_CONVERSION,
  MARKETING_PURPOSES.EVENT_PARTICIPATION,
  MARKETING_PURPOSES.NEW_SUBSCRIBER,
] as const);

/**
 * 어조 스타일 검증 스키마
 */
const toneStyleSchema = z.enum([
  TONE_STYLES.EMOTIONAL,
  TONE_STYLES.HUMOROUS,
  TONE_STYLES.PROFESSIONAL,
  TONE_STYLES.TRENDY,
  TONE_STYLES.AUTHENTIC,
] as const);

/**
 * 언어 검증 스키마
 */
const languageSchema = z.enum([
  LANGUAGES.KOREAN,
  LANGUAGES.ENGLISH,
  LANGUAGES.JAPANESE,
] as const);

/**
 * API 요청 바디 검증 스키마
 */
export const generateRequestSchema = z.object({
  // 필수 필드
  valueProposition: z
    .string()
    .min(10, "가치 제언은 최소 10자 이상이어야 합니다.")
    .max(200, "가치 제언은 최대 200자를 초과할 수 없습니다.")
    .trim(),

  gender: genderSchema,

  ageRange: ageRangeSchema,

  platforms: z
    .array(platformSchema)
    .min(1, "최소 1개 이상의 플랫폼을 선택해야 합니다.")
    .max(5, "최대 5개까지만 선택할 수 있습니다."),

  purpose: marketingPurposeSchema,

  tone: toneStyleSchema,

  language: languageSchema,

  // 선택 필드 (기본값 제공)
  includeEmojis: z.boolean().default(true),

  includeHashtags: z.boolean().default(true),

  toneIntensity: z
    .number()
    .int("톤 강도는 정수여야 합니다.")
    .min(1, "톤 강도는 최소 1입니다.")
    .max(5, "톤 강도는 최대 5입니다.")
    .default(3),

  outputCount: z
    .number()
    .int("생성 분량은 정수여야 합니다.")
    .min(1, "최소 1개 이상 생성해야 합니다.")
    .max(5, "최대 5개까지만 생성할 수 있습니다.")
    .default(3),
});

/**
 * 타입 추론
 */
export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;

/**
 * 검증 에러 포맷팅
 */
export function formatZodError(error: z.ZodError): string[] {
  return error.issues.map((err) => {
    const path = err.path.join(".");
    return `${path}: ${err.message}`;
  });
}

/**
 * 안전한 검증 함수 (Try-Catch 래퍼)
 */
export function validateGenerateRequest(data: unknown): {
  success: boolean;
  data?: GenerateRequestInput;
  errors?: string[];
} {
  try {
    const validated = generateRequestSchema.parse(data);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: formatZodError(error),
      };
    }
    return {
      success: false,
      errors: ["알 수 없는 검증 오류가 발생했습니다."],
    };
  }
}

/**
 * 부분 검증 (특정 필드만 검증)
 */
export const partialGenerateRequestSchema = generateRequestSchema.partial();

/**
 * 폼 데이터 검증 (프론트엔드용)
 */
export const formDataSchema = generateRequestSchema.extend({
  // 프론트엔드에서는 outputCount를 직접 받지 않고 platforms 길이로 계산
  outputCount: z.number().optional(),
});

/**
 * 간단한 필드별 검증 함수
 */
export const fieldValidators = {
  /**
   * 가치 제언 검증
   */
  valueProposition: (value: string): { valid: boolean; error?: string } => {
    if (!value || value.trim().length < 10) {
      return { valid: false, error: "가치 제언은 최소 10자 이상이어야 합니다." };
    }
    if (value.length > 200) {
      return { valid: false, error: "가치 제언은 최대 200자를 초과할 수 없습니다." };
    }
    return { valid: true };
  },

  /**
   * 플랫폼 배열 검증
   */
  platforms: (platforms: string[]): { valid: boolean; error?: string } => {
    if (!platforms || platforms.length === 0) {
      return { valid: false, error: "최소 1개 이상의 플랫폼을 선택해야 합니다." };
    }
    if (platforms.length > 5) {
      return { valid: false, error: "최대 5개까지만 선택할 수 있습니다." };
    }
    return { valid: true };
  },

  /**
   * 톤 강도 검증
   */
  toneIntensity: (value: number): { valid: boolean; error?: string } => {
    if (!Number.isInteger(value)) {
      return { valid: false, error: "톤 강도는 정수여야 합니다." };
    }
    if (value < 1 || value > 5) {
      return { valid: false, error: "톤 강도는 1에서 5 사이여야 합니다." };
    }
    return { valid: true };
  },

  /**
   * 생성 분량 검증
   */
  outputCount: (value: number): { valid: boolean; error?: string } => {
    if (!Number.isInteger(value)) {
      return { valid: false, error: "생성 분량은 정수여야 합니다." };
    }
    if (value < 1 || value > 5) {
      return { valid: false, error: "생성 분량은 1에서 5 사이여야 합니다." };
    }
    return { valid: true };
  },
};

