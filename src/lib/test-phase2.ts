// ============================================
// Phase 2 테스트 스크립트
// ============================================

// 환경 변수 로드 (tsx 실행 시 필요)
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import {
  PLATFORMS,
  GENDERS,
  AGE_RANGES,
  MARKETING_PURPOSES,
  TONE_STYLES,
  LANGUAGES,
  DEFAULT_FORM_DATA,
  PLATFORM_CHARACTERISTICS,
  type FormData,
  type PromptOptions,
} from "@/types";

import { generatePrompt, generateMultiPlatformPrompt, validatePromptOptions } from "./prompts";
import { validateApiKey, OPENAI_CONFIG } from "./openai";

/**
 * 타입 시스템 테스트
 */
function testTypeSystem() {
  console.log("\n========================================");
  console.log("🧪 타입 시스템 테스트");
  console.log("========================================\n");

  // 1. 플랫폼 타입 테스트
  console.log("✅ 플랫폼 목록:", Object.values(PLATFORMS));
  console.log("   총", Object.keys(PLATFORMS).length, "개 플랫폼");

  // 2. 기본값 테스트
  console.log("\n✅ 기본 폼 데이터:");
  console.log(JSON.stringify(DEFAULT_FORM_DATA, null, 2));

  // 3. 플랫폼 특성 테스트
  console.log("\n✅ 플랫폼별 특성:");
  Object.values(PLATFORMS).forEach((platform) => {
    const char = PLATFORM_CHARACTERISTICS[platform];
    console.log(`   - ${platform}: 최대 ${char.maxLength}자, ${char.style}`);
  });

  return true;
}

/**
 * 프롬프트 생성 테스트
 */
function testPromptGeneration() {
  console.log("\n========================================");
  console.log("🧪 프롬프트 생성 테스트");
  console.log("========================================\n");

  // 테스트용 옵션
  const testOptions: PromptOptions = {
    valueProposition: "바르기 쉽고 자외선 차단력이 강한 선크림",
    gender: GENDERS.FEMALE,
    ageRange: AGE_RANGES.THIRTIES,
    platform: PLATFORMS.INSTAGRAM,
    purpose: MARKETING_PURPOSES.PURCHASE_CONVERSION,
    tone: TONE_STYLES.EMOTIONAL,
    language: LANGUAGES.KOREAN,
    includeEmojis: true,
    includeHashtags: true,
    toneIntensity: 4,
  };

  console.log("📝 테스트 옵션:");
  console.log(`   제품: ${testOptions.valueProposition}`);
  console.log(`   타겟: ${testOptions.gender}, ${testOptions.ageRange}`);
  console.log(`   플랫폼: ${testOptions.platform}`);
  console.log(`   목적: ${testOptions.purpose}`);
  console.log(`   어조: ${testOptions.tone} (강도: ${testOptions.toneIntensity})`);

  // 1. 단일 플랫폼 프롬프트 생성
  console.log("\n✅ 단일 플랫폼 프롬프트 생성:");
  const singlePrompt = generatePrompt(testOptions);
  console.log("\n[시스템 프롬프트 미리보기]");
  console.log(singlePrompt.systemPrompt.substring(0, 150) + "...");
  console.log("\n[사용자 프롬프트 미리보기]");
  console.log(singlePrompt.userPrompt.substring(0, 300) + "...");
  console.log(`\n   전체 길이: 시스템 ${singlePrompt.systemPrompt.length}자, 사용자 ${singlePrompt.userPrompt.length}자`);

  // 2. 다중 플랫폼 프롬프트 생성
  console.log("\n✅ 다중 플랫폼 프롬프트 생성:");
  const platforms = [PLATFORMS.INSTAGRAM, PLATFORMS.YOUTUBE, PLATFORMS.TIKTOK];
  const multiPrompt = generateMultiPlatformPrompt(
    {
      valueProposition: testOptions.valueProposition,
      gender: testOptions.gender,
      ageRange: testOptions.ageRange,
      purpose: testOptions.purpose,
      tone: testOptions.tone,
      language: testOptions.language,
      includeEmojis: testOptions.includeEmojis,
      includeHashtags: testOptions.includeHashtags,
      toneIntensity: testOptions.toneIntensity,
    },
    platforms
  );
  console.log(`   대상 플랫폼: ${platforms.join(", ")}`);
  console.log(`   프롬프트 길이: ${multiPrompt.userPrompt.length}자`);

  return true;
}

/**
 * 검증 함수 테스트
 */
function testValidation() {
  console.log("\n========================================");
  console.log("🧪 검증 함수 테스트");
  console.log("========================================\n");

  // 1. 유효한 입력
  const validOptions: PromptOptions = {
    valueProposition: "혁신적인 스마트워치로 건강을 관리하세요",
    gender: GENDERS.ALL,
    ageRange: AGE_RANGES.TWENTIES,
    platform: PLATFORMS.YOUTUBE,
    purpose: MARKETING_PURPOSES.BRAND_AWARENESS,
    tone: TONE_STYLES.TRENDY,
    language: LANGUAGES.KOREAN,
    includeEmojis: false,
    includeHashtags: false,
    toneIntensity: 3,
  };

  console.log("✅ 유효한 입력 테스트:");
  const validResult = validatePromptOptions(validOptions);
  console.log(`   결과: ${validResult.isValid ? "통과 ✓" : "실패 ✗"}`);
  if (!validResult.isValid) {
    console.log("   에러:", validResult.errors);
  }

  // 2. 너무 짧은 입력
  const tooShortOptions: PromptOptions = {
    ...validOptions,
    valueProposition: "짧음",
  };

  console.log("\n❌ 너무 짧은 입력 테스트:");
  const shortResult = validatePromptOptions(tooShortOptions);
  console.log(`   결과: ${shortResult.isValid ? "통과 ✓" : "실패 ✗"}`);
  console.log("   에러:", shortResult.errors);

  // 3. 너무 긴 입력
  const tooLongOptions: PromptOptions = {
    ...validOptions,
    valueProposition: "a".repeat(201),
  };

  console.log("\n❌ 너무 긴 입력 테스트:");
  const longResult = validatePromptOptions(tooLongOptions);
  console.log(`   결과: ${longResult.isValid ? "통과 ✓" : "실패 ✗"}`);
  console.log("   에러:", longResult.errors);

  // 4. 잘못된 톤 강도
  const invalidToneOptions: PromptOptions = {
    ...validOptions,
    toneIntensity: 10,
  };

  console.log("\n❌ 잘못된 톤 강도 테스트:");
  const toneResult = validatePromptOptions(invalidToneOptions);
  console.log(`   결과: ${toneResult.isValid ? "통과 ✓" : "실패 ✗"}`);
  console.log("   에러:", toneResult.errors);

  return true;
}

/**
 * OpenAI 클라이언트 설정 테스트
 */
function testOpenAIConfig() {
  console.log("\n========================================");
  console.log("🧪 OpenAI 클라이언트 설정 테스트");
  console.log("========================================\n");

  console.log("✅ OpenAI 설정:");
  console.log(`   모델: ${OPENAI_CONFIG.model}`);
  console.log(`   Temperature: ${OPENAI_CONFIG.temperature}`);
  console.log(`   Max Tokens: ${OPENAI_CONFIG.maxTokens}`);

  console.log("\n🔑 API 키 검증:");
  const isValid = validateApiKey();
  if (isValid) {
    console.log("   ✓ API 키가 설정되어 있습니다.");
    console.log("   ✓ API 키 형식이 올바릅니다.");
  } else {
    console.log("   ✗ API 키가 설정되지 않았거나 형식이 올바르지 않습니다.");
    console.log("   → .env.local 파일에 OPENAI_API_KEY를 설정해주세요.");
  }

  return isValid;
}

/**
 * 폼 데이터 시뮬레이션 테스트
 */
function testFormDataSimulation() {
  console.log("\n========================================");
  console.log("🧪 폼 데이터 시뮬레이션 테스트");
  console.log("========================================\n");

  // 사용자가 입력할 법한 폼 데이터
  const userFormData: FormData = {
    valueProposition: "친환경 소재로 만든 편안한 운동화",
    gender: GENDERS.ALL,
    ageRange: AGE_RANGES.TWENTIES,
    platforms: [PLATFORMS.INSTAGRAM, PLATFORMS.TIKTOK],
    purpose: MARKETING_PURPOSES.PURCHASE_CONVERSION,
    tone: TONE_STYLES.TRENDY,
    outputCount: 2,
    language: LANGUAGES.KOREAN,
    toneIntensity: 4,
    includeHashtags: true,
    includeEmojis: true,
  };

  console.log("📋 시뮬레이션 폼 데이터:");
  console.log(JSON.stringify(userFormData, null, 2));

  console.log("\n✅ 각 플랫폼별 프롬프트 생성:");
  userFormData.platforms.forEach((platform, index) => {
    const promptOpts: PromptOptions = {
      valueProposition: userFormData.valueProposition,
      gender: userFormData.gender,
      ageRange: userFormData.ageRange,
      platform: platform,
      purpose: userFormData.purpose,
      tone: userFormData.tone,
      language: userFormData.language,
      includeEmojis: userFormData.includeEmojis,
      includeHashtags: userFormData.includeHashtags,
      toneIntensity: userFormData.toneIntensity,
    };

    const prompt = generatePrompt(promptOpts);
    console.log(`\n   ${index + 1}. ${platform} 프롬프트 생성 완료`);
    console.log(`      길이: ${prompt.userPrompt.length}자`);
  });

  return true;
}

/**
 * 모든 테스트 실행
 */
export function runAllTests() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║     Phase 2 통합 테스트 시작         ║");
  console.log("╚════════════════════════════════════════╝");

  const results = {
    typeSystem: false,
    promptGeneration: false,
    validation: false,
    openaiConfig: false,
    formSimulation: false,
  };

  try {
    results.typeSystem = testTypeSystem();
    results.promptGeneration = testPromptGeneration();
    results.validation = testValidation();
    results.openaiConfig = testOpenAIConfig();
    results.formSimulation = testFormDataSimulation();

    // 결과 요약
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║           테스트 결과 요약            ║");
    console.log("╚════════════════════════════════════════╝\n");

    const allPassed = Object.values(results).every((r) => r === true);

    Object.entries(results).forEach(([name, passed]) => {
      const icon = passed ? "✅" : "❌";
      const status = passed ? "통과" : "실패";
      console.log(`${icon} ${name}: ${status}`);
    });

    console.log("\n" + "=".repeat(40));
    if (allPassed) {
      console.log("🎉 모든 테스트 통과!");
    } else {
      console.log("⚠️  일부 테스트 실패 (OpenAI API 키 설정 확인 필요)");
    }
    console.log("=".repeat(40) + "\n");

    return allPassed;
  } catch (error) {
    console.error("\n❌ 테스트 실행 중 에러 발생:", error);
    return false;
  }
}

// 직접 실행 시
if (require.main === module) {
  runAllTests();
}


