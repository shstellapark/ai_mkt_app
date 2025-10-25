// ============================================
// 마케팅 문구 생성 앱 타입 정의
// ============================================

// -------------------- 기본 열거형 타입 --------------------

/**
 * 지원 플랫폼 목록
 */
export const PLATFORMS = {
  INSTAGRAM: "인스타그램",
  YOUTUBE: "유튜브",
  FACEBOOK: "페이스북",
  TIKTOK: "틱톡",
  BLOG: "블로그",
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS];

/**
 * 성별 옵션
 */
export const GENDERS = {
  MALE: "남성",
  FEMALE: "여성",
  ALL: "전체",
} as const;

export type Gender = typeof GENDERS[keyof typeof GENDERS];

/**
 * 연령대 옵션
 */
export const AGE_RANGES = {
  TEENS: "10대",
  TWENTIES: "20대",
  THIRTIES: "30대",
  FORTIES: "40대",
  FIFTIES_PLUS: "50대 이상",
} as const;

export type AgeRange = typeof AGE_RANGES[keyof typeof AGE_RANGES];

/**
 * 마케팅 목적
 */
export const MARKETING_PURPOSES = {
  BRAND_AWARENESS: "브랜드 인지도",
  PURCHASE_CONVERSION: "제품 구매 유도",
  EVENT_PARTICIPATION: "이벤트 참여",
  NEW_SUBSCRIBER: "신규 구독자 유입",
} as const;

export type MarketingPurpose = typeof MARKETING_PURPOSES[keyof typeof MARKETING_PURPOSES];

/**
 * 어조 스타일
 */
export const TONE_STYLES = {
  EMOTIONAL: "감성적",
  HUMOROUS: "유머러스",
  PROFESSIONAL: "전문적",
  TRENDY: "트렌디",
  AUTHENTIC: "진정성 있는",
} as const;

export type ToneStyle = typeof TONE_STYLES[keyof typeof TONE_STYLES];

/**
 * 지원 언어
 */
export const LANGUAGES = {
  KOREAN: "한국어",
  ENGLISH: "영어",
  JAPANESE: "일본어",
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// -------------------- 폼 데이터 인터페이스 --------------------

/**
 * 사용자 입력 폼 데이터
 */
export interface FormData {
  // 필수 입력
  valueProposition: string; // 가치 제언 (10~200자)
  
  // 기본 타겟 옵션
  gender: Gender;
  ageRange: AgeRange;
  platforms: Platform[]; // 최소 1개 이상
  purpose: MarketingPurpose;
  tone: ToneStyle;
  outputCount: number; // 1~5개
  
  // 고급 옵션
  language: Language;
  toneIntensity: number; // 1~5 (부드럽게 ~ 강렬하게)
  includeHashtags: boolean;
  includeEmojis: boolean;
}

/**
 * 폼 검증 에러
 */
export interface FormErrors {
  valueProposition?: string;
  platforms?: string;
  [key: string]: string | undefined;
}

// -------------------- API 요청/응답 인터페이스 --------------------

/**
 * API 요청 바디
 */
export interface GenerateRequest {
  valueProposition: string;
  gender: Gender;
  ageRange: AgeRange;
  platforms: Platform[];
  purpose: MarketingPurpose;
  tone: ToneStyle;
  language: Language;
  includeEmojis: boolean;
  includeHashtags: boolean;
  toneIntensity: number;
  outputCount: number;
}

/**
 * 생성된 개별 문구
 */
export interface GeneratedCopy {
  platform: Platform;
  text: string;
}

/**
 * API 응답 (성공)
 */
export interface GenerateResponse {
  status: "success";
  generated_copies: GeneratedCopy[];
  metadata?: {
    model: string;
    tokensUsed?: number;
    generatedAt: string;
  };
}

/**
 * API 응답 (에러)
 */
export interface ErrorResponse {
  status: "error";
  message: string;
  code?: string;
}

// -------------------- 프롬프트 관련 타입 --------------------

/**
 * 프롬프트 구성 옵션
 */
export interface PromptOptions {
  valueProposition: string;
  gender: Gender;
  ageRange: AgeRange;
  platform: Platform;
  purpose: MarketingPurpose;
  tone: ToneStyle;
  language: Language;
  includeEmojis: boolean;
  includeHashtags: boolean;
  toneIntensity: number;
}

/**
 * 플랫폼별 특성 정의
 */
export interface PlatformCharacteristics {
  platform: Platform;
  maxLength: number; // 권장 최대 글자 수
  style: string; // 스타일 가이드
  features: string[]; // 주요 특징
}

// -------------------- UI 상태 관련 타입 --------------------

/**
 * 생성 상태
 */
export type GenerationStatus = "idle" | "loading" | "success" | "error";

/**
 * 앱 전체 상태
 */
export interface AppState {
  formData: FormData;
  generatedCopies: GeneratedCopy[];
  status: GenerationStatus;
  error: string | null;
}

// -------------------- 유틸리티 타입 --------------------

/**
 * 옵션 아이템 (Select, Radio 등에서 사용)
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
}

/**
 * 폼 필드 설정
 */
export interface FormFieldConfig {
  name: keyof FormData;
  label: string;
  type: "text" | "select" | "radio" | "checkbox" | "slider" | "switch";
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: SelectOption[];
}

// -------------------- 상수 배열 (UI에서 사용) --------------------

/**
 * 플랫폼 옵션 배열
 */
export const PLATFORM_OPTIONS: SelectOption<Platform>[] = Object.entries(PLATFORMS).map(
  ([key, value]) => ({
    label: value,
    value: value,
  })
);

/**
 * 성별 옵션 배열
 */
export const GENDER_OPTIONS: SelectOption<Gender>[] = Object.entries(GENDERS).map(
  ([key, value]) => ({
    label: value,
    value: value,
  })
);

/**
 * 연령대 옵션 배열
 */
export const AGE_RANGE_OPTIONS: SelectOption<AgeRange>[] = Object.entries(AGE_RANGES).map(
  ([key, value]) => ({
    label: value,
    value: value,
  })
);

/**
 * 마케팅 목적 옵션 배열
 */
export const MARKETING_PURPOSE_OPTIONS: SelectOption<MarketingPurpose>[] = Object.entries(
  MARKETING_PURPOSES
).map(([key, value]) => ({
  label: value,
  value: value,
}));

/**
 * 어조 스타일 옵션 배열
 */
export const TONE_STYLE_OPTIONS: SelectOption<ToneStyle>[] = Object.entries(TONE_STYLES).map(
  ([key, value]) => ({
    label: value,
    value: value,
  })
);

/**
 * 언어 옵션 배열
 */
export const LANGUAGE_OPTIONS: SelectOption<Language>[] = Object.entries(LANGUAGES).map(
  ([key, value]) => ({
    label: value,
    value: value,
  })
);

// -------------------- 기본값 --------------------

/**
 * 폼 데이터 기본값
 */
export const DEFAULT_FORM_DATA: FormData = {
  valueProposition: "",
  gender: GENDERS.ALL,
  ageRange: AGE_RANGES.TWENTIES,
  platforms: [PLATFORMS.INSTAGRAM],
  purpose: MARKETING_PURPOSES.BRAND_AWARENESS,
  tone: TONE_STYLES.EMOTIONAL,
  outputCount: 3,
  language: LANGUAGES.KOREAN,
  toneIntensity: 3,
  includeHashtags: true,
  includeEmojis: true,
};

/**
 * 플랫폼별 특성 맵
 */
export const PLATFORM_CHARACTERISTICS: Record<Platform, PlatformCharacteristics> = {
  [PLATFORMS.INSTAGRAM]: {
    platform: PLATFORMS.INSTAGRAM,
    maxLength: 150,
    style: "짧고 감성적, 시각적",
    features: ["해시태그 중심", "이모지 활용", "간결한 메시지"],
  },
  [PLATFORMS.YOUTUBE]: {
    platform: PLATFORMS.YOUTUBE,
    maxLength: 200,
    style: "서사적, 클릭 유도",
    features: ["호기심 유발", "질문형 제목", "구체적 정보"],
  },
  [PLATFORMS.FACEBOOK]: {
    platform: PLATFORMS.FACEBOOK,
    maxLength: 180,
    style: "커뮤니티 중심, 참여 유도",
    features: ["스토리텔링", "공감 형성", "대화형 톤"],
  },
  [PLATFORMS.TIKTOK]: {
    platform: PLATFORMS.TIKTOK,
    maxLength: 100,
    style: "트렌디, 짧고 강렬",
    features: ["임팩트 있는 첫 문장", "트렌드 반영", "액션 유도"],
  },
  [PLATFORMS.BLOG]: {
    platform: PLATFORMS.BLOG,
    maxLength: 300,
    style: "상세하고 정보 제공",
    features: ["SEO 최적화", "구조화된 정보", "신뢰성"],
  },
};

// -------------------- 히스토리 및 즐겨찾기 타입 --------------------

/**
 * 생성 히스토리 아이템
 */
export interface HistoryItem {
  id: string;
  timestamp: string;
  valueProposition: string;
  formData: Omit<FormData, "valueProposition">;
  result: GenerateResponse;
  isFavorite?: boolean;
}

/**
 * 히스토리 필터 옵션
 */
export interface HistoryFilter {
  searchTerm?: string;
  platform?: Platform;
  favoritesOnly?: boolean;
  sortBy?: "newest" | "oldest";
}
