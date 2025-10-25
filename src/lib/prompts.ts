// ============================================
// 프롬프트 엔지니어링 템플릿
// ============================================

import type {
  PromptOptions,
  Platform,
  Gender,
  AgeRange,
  MarketingPurpose,
  ToneStyle,
  Language,
} from "@/types";
import { PLATFORM_CHARACTERISTICS } from "@/types";

// -------------------- 시스템 프롬프트 --------------------

/**
 * 기본 시스템 프롬프트
 * AI의 역할과 전문성을 정의합니다.
 */
export const SYSTEM_PROMPT = `당신은 20년 경력의 마케팅 카피라이터입니다.
다양한 플랫폼과 타겟에 맞춘 효과적인 마케팅 문구를 작성하는 전문가입니다.

당신의 역할:
- 타겟 고객의 감정을 움직이는 설득력 있는 문구 작성
- 플랫폼별 특성을 완벽하게 이해하고 최적화된 콘텐츠 제공
- 브랜드 가치와 제품의 핵심 메시지를 명확하게 전달
- 측정 가능한 마케팅 성과를 달성하는 카피 작성

핵심 원칙:
1. 간결하고 명확한 메시지
2. 타겟의 언어와 톤 사용
3. 행동을 유도하는 강력한 CTA (Call To Action)
4. 플랫폼별 최적화된 형식과 길이`;

// -------------------- 플랫폼별 가이드라인 --------------------

/**
 * 플랫폼별 상세 가이드라인
 */
const PLATFORM_GUIDELINES = {
  인스타그램: `
인스타그램 마케팅 문구 작성 가이드라인:
- 첫 1-2문장에 핵심 메시지 압축 (150자 이내 권장)
- 이모지를 자연스럽게 활용하여 시각적 매력 증대
- 해시태그 3-5개 포함 (관련성 높고 검색 가능한 태그)
- 시각적 콘텐츠와 함께 작동하는 캡션 작성
- 질문형 또는 공감 유도 문장으로 참여 유도`,

  유튜브: `
유튜브 마케팅 문구 작성 가이드라인:
- 호기심을 자극하는 제목 스타일 (200자 이내)
- 클릭을 유도하는 임팩트 있는 첫 문장
- 구체적인 혜택이나 결과 제시
- 영상 내용을 암시하되 너무 많이 공개하지 않음
- 시청자의 문제나 궁금증 해결 약속`,

  페이스북: `
페이스북 마케팅 문구 작성 가이드라인:
- 스토리텔링 형식으로 공감 형성 (180자 이내 권장)
- 커뮤니티 중심의 대화형 톤
- 댓글과 공유를 유도하는 질문 포함
- 감정적 연결을 만드는 개인적인 어조
- 친구에게 말하듯 자연스러운 문체`,

  틱톡: `
틱톡 마케팅 문구 작성 가이드라인:
- 짧고 강렬한 메시지 (100자 이내)
- 트렌드를 반영한 최신 용어 사용
- 즉각적인 반응을 유도하는 액션 중심
- Z세대 감성에 맞는 캐주얼한 톤
- 첫 3초에 주목을 끄는 훅`,

  블로그: `
블로그 마케팅 문구 작성 가이드라인:
- 정보 제공 중심의 상세한 설명 (300자 이내)
- SEO를 고려한 키워드 자연스럽게 포함
- 신뢰성과 전문성을 보여주는 톤
- 구조화된 정보로 읽기 쉽게 작성
- 심층적인 가치 제공에 초점`,
};

// -------------------- 타겟별 어조 조정 --------------------

/**
 * 성별에 따른 어조 조정
 */
function getGenderTone(gender: Gender): string {
  switch (gender) {
    case "남성":
      return "남성 타겟을 고려하여 직접적이고 논리적인 어조를 사용하세요.";
    case "여성":
      return "여성 타겟을 고려하여 감성적이고 공감적인 어조를 사용하세요.";
    case "전체":
      return "성별 구분 없이 보편적으로 공감할 수 있는 중립적 어조를 사용하세요.";
    default:
      return "";
  }
}

/**
 * 연령대에 따른 언어 스타일
 */
function getAgeRangeTone(ageRange: AgeRange): string {
  switch (ageRange) {
    case "10대":
      return "10대가 사용하는 트렌디한 신조어와 유행어를 활용하고, 짧고 임팩트 있는 문장을 사용하세요.";
    case "20대":
      return "20대의 라이프스타일과 가치관을 반영하고, 자기 표현과 개성을 중시하는 메시지를 전달하세요.";
    case "30대":
      return "30대의 실용성과 품질을 중시하는 가치관을 반영하고, 신뢰감 있는 전문적인 톤을 사용하세요.";
    case "40대":
      return "40대의 경험과 안정성을 중시하는 특성을 고려하고, 가치와 혜택을 명확히 제시하세요.";
    case "50대 이상":
      return "50대 이상의 신중하고 세심한 특성을 고려하고, 명확하고 이해하기 쉬운 메시지를 전달하세요.";
    default:
      return "";
  }
}

/**
 * 마케팅 목적에 따른 CTA 전략
 */
function getMarketingPurposeTone(purpose: MarketingPurpose): string {
  switch (purpose) {
    case "브랜드 인지도":
      return "브랜드의 핵심 가치와 정체성을 각인시키는 데 초점을 맞추세요. 기억에 남는 메시지를 만드세요.";
    case "제품 구매 유도":
      return "구체적인 혜택과 가치를 강조하고, 즉각적인 구매 행동을 유도하는 강력한 CTA를 포함하세요.";
    case "이벤트 참여":
      return "이벤트의 매력과 참여 방법을 명확히 제시하고, FOMO(놓칠 수 있다는 두려움)를 활용하세요.";
    case "신규 구독자 유입":
      return "구독 시 얻을 수 있는 가치와 혜택을 구체적으로 제시하고, 쉬운 구독 방법을 안내하세요.";
    default:
      return "";
  }
}

/**
 * 어조 스타일 가이드
 */
function getToneStyleGuide(tone: ToneStyle): string {
  switch (tone) {
    case "감성적":
      return "감정에 호소하는 따뜻하고 공감적인 언어를 사용하세요. 개인적인 경험과 감정을 자극하세요.";
    case "유머러스":
      return "위트 있고 재미있는 표현을 활용하되, 브랜드 이미지를 해치지 않는 선에서 유머를 더하세요.";
    case "전문적":
      return "신뢰감 있고 권위 있는 전문가적 톤을 유지하세요. 정확한 정보와 데이터를 활용하세요.";
    case "트렌디":
      return "최신 트렌드와 유행을 반영하고, 현대적이고 세련된 언어를 사용하세요.";
    case "진정성 있는":
      return "솔직하고 투명한 커뮤니케이션으로 신뢰를 구축하세요. 과장 없이 진실된 메시지를 전달하세요.";
    default:
      return "";
  }
}

/**
 * 톤 강도 조절
 */
function getToneIntensityGuide(intensity: number): string {
  if (intensity <= 2) {
    return "부드럽고 온화한 표현을 사용하여 친근하게 접근하세요.";
  } else if (intensity <= 3) {
    return "적절한 균형을 유지하며 자연스럽게 메시지를 전달하세요.";
  } else if (intensity <= 4) {
    return "확신에 찬 강한 표현으로 주목을 끌고 행동을 촉구하세요.";
  } else {
    return "강렬하고 임팩트 있는 표현으로 즉각적인 반응을 이끌어내세요.";
  }
}

/**
 * 언어별 가이드라인
 */
function getLanguageGuide(language: Language): string {
  switch (language) {
    case "한국어":
      return "한국어로 작성하되, 한국 문화와 정서에 맞는 표현을 사용하세요.";
    case "영어":
      return "영어로 작성하되, 글로벌 감각에 맞는 자연스러운 영어 표현을 사용하세요.";
    case "일본어":
      return "일본어로 작성하되, 일본 문화의 예의와 정중함을 반영하세요.";
    default:
      return "한국어로 작성하세요.";
  }
}

// -------------------- 프롬프트 생성 함수 --------------------

/**
 * 플랫폼별 최적화된 프롬프트 생성
 */
export function generatePrompt(options: PromptOptions): {
  systemPrompt: string;
  userPrompt: string;
} {
  const {
    valueProposition,
    gender,
    ageRange,
    platform,
    purpose,
    tone,
    language,
    includeEmojis,
    includeHashtags,
    toneIntensity,
  } = options;

  // 플랫폼 특성 가져오기
  const platformChar = PLATFORM_CHARACTERISTICS[platform];
  const platformGuideline = PLATFORM_GUIDELINES[platform] || "";

  // 사용자 프롬프트 구성
  const userPrompt = `
다음 조건에 맞는 ${platform} 마케팅 문구를 1개 작성해주세요:

【제품/서비스 가치 제언】
${valueProposition}

【타겟 정보】
- 성별: ${gender}
- 연령대: ${ageRange}

【마케팅 목적】
${purpose}

【작성 가이드라인】
${platformGuideline}

【타겟 맞춤 어조】
- ${getGenderTone(gender)}
- ${getAgeRangeTone(ageRange)}
- ${getToneStyleGuide(tone)}
- ${getToneIntensityGuide(toneIntensity)}

【마케팅 전략】
${getMarketingPurposeTone(purpose)}

【언어 및 형식】
- ${getLanguageGuide(language)}
- 권장 최대 길이: ${platformChar.maxLength}자
${includeEmojis ? "- 이모지를 적절히 활용하세요." : "- 이모지를 사용하지 마세요."}
${includeHashtags && platform === "인스타그램" ? "- 관련성 높은 해시태그 3-5개를 포함하세요." : ""}
${includeHashtags && platform === "틱톡" ? "- 트렌디한 해시태그 2-3개를 포함하세요." : ""}

【출력 형식】
마케팅 문구만 작성하고, 설명이나 추가 코멘트는 포함하지 마세요.
`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: userPrompt.trim(),
  };
}

/**
 * 여러 플랫폼에 대한 프롬프트를 일괄 생성
 */
export function generateMultiPlatformPrompt(
  options: Omit<PromptOptions, "platform">,
  platforms: Platform[]
): {
  systemPrompt: string;
  userPrompt: string;
} {
  const {
    valueProposition,
    gender,
    ageRange,
    purpose,
    tone,
    language,
    includeEmojis,
    includeHashtags,
    toneIntensity,
  } = options;

  // 각 플랫폼별 가이드라인 결합
  const platformGuidelines = platforms
    .map((platform) => {
      const char = PLATFORM_CHARACTERISTICS[platform];
      return `\n[${platform}]
${PLATFORM_GUIDELINES[platform]}
- 권장 최대 길이: ${char.maxLength}자`;
    })
    .join("\n");

  const userPrompt = `
다음 조건에 맞는 마케팅 문구를 각 플랫폼별로 1개씩 작성해주세요:

【제품/서비스 가치 제언】
${valueProposition}

【타겟 정보】
- 성별: ${gender}
- 연령대: ${ageRange}

【마케팅 목적】
${purpose}

【플랫폼별 작성 가이드라인】
${platformGuidelines}

【타겟 맞춤 어조】
- ${getGenderTone(gender)}
- ${getAgeRangeTone(ageRange)}
- ${getToneStyleGuide(tone)}
- ${getToneIntensityGuide(toneIntensity)}

【마케팅 전략】
${getMarketingPurposeTone(purpose)}

【언어 및 형식】
- ${getLanguageGuide(language)}
${includeEmojis ? "- 이모지를 적절히 활용하세요." : "- 이모지를 사용하지 마세요."}
${includeHashtags ? "- 인스타그램과 틱톡의 경우 해시태그를 포함하세요." : ""}

【출력 형식】
다음 JSON 형식으로만 응답하세요:
{
  "copies": [
    {
      "platform": "플랫폼명",
      "text": "마케팅 문구"
    }
  ]
}

각 플랫폼(${platforms.join(", ")})에 대해 1개씩, 총 ${platforms.length}개의 문구를 생성하세요.
`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: userPrompt.trim(),
  };
}

/**
 * 프롬프트 품질 검증
 */
export function validatePromptOptions(options: PromptOptions): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 가치 제언 검증
  if (!options.valueProposition || options.valueProposition.trim().length < 10) {
    errors.push("가치 제언은 최소 10자 이상이어야 합니다.");
  }

  if (options.valueProposition.length > 200) {
    errors.push("가치 제언은 최대 200자를 초과할 수 없습니다.");
  }

  // 톤 강도 검증
  if (options.toneIntensity < 1 || options.toneIntensity > 5) {
    errors.push("톤 강도는 1에서 5 사이여야 합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


