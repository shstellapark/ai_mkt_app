# OpenAI API 키 설정 가이드

## 🔍 문제 상황

API 키를 `.env.local`에 설정했는데도 `npm run test:phase2` 실행 시 `openaiConfig` 테스트가 실패하는 경우

---

## ✅ 해결 완료!

**원인**: `tsx`로 TypeScript 파일을 직접 실행할 때 `.env.local` 파일이 자동으로 로드되지 않음

**해결책**: 테스트 스크립트에 `dotenv` 패키지를 사용하여 환경 변수를 명시적으로 로드

---

## 📝 단계별 설정 방법

### 1. OpenAI API 키 발급

1. https://platform.openai.com/api-keys 접속
2. "Create new secret key" 클릭
3. API 키 복사 (예: `sk-proj-...`)

### 2. `.env.local` 파일 생성 및 설정

프로젝트 루트 폴더에 `.env.local` 파일이 이미 생성되어 있습니다.  
파일을 열고 다음과 같이 수정하세요:

```env
# OpenAI API 설정
OPENAI_API_KEY=sk-proj-your-actual-key-here  # 여기에 실제 키 붙여넣기

# OpenAI 모델 설정 (선택사항)
OPENAI_MODEL=gpt-4o

# API 설정 (선택사항)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**주의사항**:
- ✅ `=` 앞뒤에 공백 없이 작성
- ✅ 따옴표 없이 키만 입력
- ✅ 줄바꿈 없이 한 줄로 작성
- ❌ `OPENAI_API_KEY = "sk-proj-..."` (잘못된 예시)
- ✅ `OPENAI_API_KEY=sk-proj-...` (올바른 예시)

### 3. 환경 변수 확인

다음 명령어로 API 키가 제대로 설정되었는지 확인:

```bash
node check-env.js
```

**정상 출력 예시**:
```
========================================
환경 변수 디버그
========================================

작업 디렉토리: D:\cursor_ws\ai_mkt_app
.env.local 경로: D:\cursor_ws\ai_mkt_app\.env.local
.env.local 파일 존재: 예
dotenv 로드 성공

----------------------------------------

1. .env.local 파일 위치: D:\cursor_ws\ai_mkt_app\.env.local
2. OPENAI_API_KEY 존재 여부: ✅ 존재함
3. API 키 길이: 164 자
4. API 키 시작 부분: sk-proj-KM...
5. API 키 형식 검증: ✅ 올바름
```

### 4. Phase 2 테스트 실행

```bash
npm run test:phase2
```

**성공 시 출력**:
```
✅ typeSystem: 통과
✅ promptGeneration: 통과
✅ validation: 통과
✅ openaiConfig: 통과  ← 이제 통과!
✅ formSimulation: 통과

========================================
🎉 모든 테스트 통과!
========================================
```

---

## 🔧 적용된 수정사항

### 파일: `src/lib/test-phase2.ts`

테스트 스크립트 상단에 다음 코드가 추가되었습니다:

```typescript
// 환경 변수 로드 (tsx 실행 시 필요)
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
```

이제 `tsx`로 실행할 때도 `.env.local` 파일이 자동으로 로드됩니다.

---

## 🔒 보안 주의사항

### `.env.local` 파일은 절대 Git에 커밋하지 마세요!

- ✅ `.gitignore`에 이미 `.env*` 패턴이 등록되어 있음
- ✅ API 키는 개인 정보이므로 공유 금지
- ✅ GitHub, GitLab 등에 업로드하지 않도록 주의

### 배포 시 환경 변수 설정

**Vercel 배포 시**:
1. Vercel Dashboard → 프로젝트 선택
2. Settings → Environment Variables
3. `OPENAI_API_KEY` 추가
4. `OPENAI_MODEL=gpt-4o` 추가 (선택사항)

---

## ❓ 문제 해결

### Q1: 여전히 API 키를 찾을 수 없다고 나옵니다.

**체크리스트**:
- [ ] `.env.local` 파일이 프로젝트 루트에 있나요?
- [ ] 파일 이름이 정확히 `.env.local`인가요? (`.env.local.txt` 아님)
- [ ] `OPENAI_API_KEY=` 형식이 맞나요? (공백, 따옴표 없음)
- [ ] API 키가 `sk-`로 시작하나요?

### Q2: API 키 형식이 잘못되었다고 나옵니다.

OpenAI API 키는 다음 형식을 따릅니다:
- 이전 형식: `sk-...` (약 51자)
- 프로젝트 키: `sk-proj-...` (약 164자)

둘 다 사용 가능하며, `sk-`로 시작해야 합니다.

### Q3: Node.js 앱에서는 작동하는데 Next.js에서 안 됩니다.

Next.js는 자동으로 `.env.local`을 로드하지만, **서버 사이드에서만** 접근 가능합니다.

- ✅ API 라우트 (`app/api/`): 사용 가능
- ✅ Server Components: 사용 가능
- ❌ Client Components (`'use client'`): 사용 불가

클라이언트에서 사용하려면 `NEXT_PUBLIC_` 접두사가 필요하지만,  
**API 키는 절대 클라이언트에 노출하면 안 됩니다!**

---

## ✅ 현재 상태

- [x] `.env.local` 파일 생성
- [x] OpenAI API 키 설정
- [x] `dotenv` 패키지 설치
- [x] 테스트 스크립트 수정
- [x] API 키 검증 성공
- [x] 모든 Phase 2 테스트 통과

**다음 단계**: Phase 3 (백엔드 API 구현) 진행 가능! 🚀

---

**작성일**: 2025-10-20  
**상태**: ✅ 해결 완료

