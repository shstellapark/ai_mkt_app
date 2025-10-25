#요구사항 명세세


# 🧠 마케팅 문구 자동 생성 웹서비스 기능 명세서

**Framework:** Next.js (App Router)
**AI 엔진:** OpenAI API (GPT-5 기반)
**작성 목적:** 타겟 및 플랫폼별 맞춤형 마케팅 문구 자동 생성 서비스 기획 및 개발 명세

---

## 1. 🎯 서비스 개요

사용자가 입력한 **가치 제언(Value Proposition)** 과 **타겟 속성**을 기반으로,
OpenAI API를 이용해 **마케팅 효과가 높은 카피문구를 자동 생성**하는 웹서비스.

---

## 2. 🧩 주요 기능 구성

### 2.1. 입력 섹션 (Input Section)

* **① 가치 제언 입력창 (TextArea)**

  * Placeholder: `"예: 바르기 쉽고 자외선 차단력이 강한 선크림"`
  * 제한: 최소 10자 / 최대 200자
  * Validation: 필수 입력

* **② 타겟 선택 옵션 (Targeting Options)**

  | 옵션명    | 유형     | 선택 항목 예시                                | 설명               |
  | ------ | ------ | --------------------------------------- | ---------------- |
  | 성별     | 라디오 버튼 | 남성 / 여성 / 전체                            | 타겟 성별에 따른 어조 변화  |
  | 연령대    | 드롭다운   | 10대 / 20대 / 30대 / 40대 / 50대 이상          | 세대별 언어톤 및 관심사 반영 |
  | 플랫폼    | 멀티셀렉트  | 인스타그램 / 유튜브 / 페이스북 / 틱톡 / 블로그           | 플랫폼 특성에 맞는 문체 생성 |
  | 마케팅 목적 | 드롭다운   | 브랜드 인지도 / 제품 구매 유도 / 이벤트 참여 / 신규 구독자 유입 | 카피 톤 결정 기준       |
  | 어조 스타일 | 드롭다운   | 감성적 / 유머러스 / 전문적 / 트렌디 / 진정성 있는         | 문체 스타일 조정        |
  | 생성 분량  | 슬라이더   | 1~5개                                    | 생성되는 문구 개수 선택    |

* **③ 추가 설정 옵션 (Advanced Options)**

  | 옵션명        | 유형   | 설명                |
  | ---------- | ---- | ----------------- |
  | 언어 선택      | 드롭다운 | 한국어 / 영어 / 일본어 등  |
  | 톤 강도       | 슬라이더 | 1(부드럽게) ~ 5(강렬하게) |
  | 해시태그 포함 여부 | 토글   | SNS용 해시태그 자동 생성   |
  | 이모지 포함 여부  | 토글   | 감정 표현용 이모지 자동 포함  |

---

## 3. ⚙️ 마케팅 문구 생성 프로세스

1. 사용자가 입력값과 옵션을 설정
2. “**문구 생성하기**” 버튼 클릭
3. OpenAI API 호출 (POST /api/generate)
4. AI 응답을 **JSON 형태**로 받아 화면에 출력

---

## 4. 🧾 API 명세 (백엔드)

### ▶ `/api/generate`

**Method:** `POST`
**Request Body (예시):**

```json
{
  "valueProposition": "자외선 차단력이 강한 선크림",
  "gender": "여성",
  "ageRange": "30대",
  "platforms": ["인스타그램", "유튜브"],
  "purpose": "제품 구매 유도",
  "tone": "감성적",
  "language": "한국어",
  "includeEmojis": true,
  "includeHashtags": true,
  "toneIntensity": 4,
  "outputCount": 3
}
```

**Response (예시):**

```json
{
  "status": "success",
  "generated_copies": [
    {
      "platform": "인스타그램",
      "text": "햇살 아래에서도 피부는 편안하게 🌞 #자외선차단 #피부보호"
    },
    {
      "platform": "유튜브",
      "text": "30대 여성을 위한 진짜 선크림 리뷰 — 민감한 피부도 안심하세요 💛"
    }
  ]
}
```

---

## 5. 💻 프론트엔드 구조

### 폴더 구조 (Next.js)

```
/app
 ├─ /page.tsx                  # 메인 페이지
 ├─ /api/generate/route.ts     # OpenAI API 호출 라우트
 ├─ /components
 │   ├─ InputForm.tsx          # 입력 폼 컴포넌트
 │   ├─ OptionSelector.tsx     # 옵션 선택 UI
 │   ├─ ResultViewer.tsx       # 결과 JSON 출력창
 │   └─ GenerateButton.tsx     # 생성 버튼
 ├─ /lib/openai.ts             # OpenAI API 클라이언트
```

### UI 구성

* **shadcn/ui** 및 **Tailwind CSS** 사용
* 반응형 카드형 레이아웃
* “결과창(ResultViewer)”은 코드 블록(JSON) 형태로 표현
* 로딩 상태 시 스피너 표시 (예: `<Loader2 />` 아이콘)

---

## 6. 🎨 UX/UI 포인트

* **시각적 강조**: 입력창은 중앙, 결과창은 아래 카드 형태
* **상호작용 강조**: 옵션 변경 시 프리뷰 영역 실시간 반응
* **피드백 제공**: API 응답 실패 시 에러 메시지 표시
* **JSON 결과 복사 버튼** 제공

---

## 7. 🔐 기술 스택

| 구분             | 기술                                            |
| -------------- | --------------------------------------------- |
| Frontend       | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| Backend        | Next.js API Routes                            |
| AI Integration | OpenAI GPT-5 API                              |
| Data Type      | JSON                                          |
| 배포             | Vercel                                        |

---

## 8. ✅ 개발 핵심 포인트

* API 호출 시 사용자 프롬프트 최적화 (Prompt Engineering)
* 마케팅 효과 향상 위해 플랫폼별 어투 사전 정의
* 결과 JSON 구조 통일화
* 옵션별 생성 다양성 유지 (온도 조정: 0.7~0.9)

---

## 9. 🚀 개발 구현 단계

### **Phase 1: 개발 환경 구축** (약 30분)

#### 1.1 Shadcn UI 설치 및 설정
- `npx shadcn@latest init` 실행
- 필요 컴포넌트 설치
  - Button, Card, Select, Textarea, Slider
  - Label, RadioGroup, Checkbox, Badge
  - Dialog, Toast, Separator

#### 1.2 환경 변수 설정
- `.env.local` 파일 생성
- OpenAI API 키 설정
  ```env
  OPENAI_API_KEY=your_api_key_here
  ```

#### 1.3 추가 의존성 설치
```bash
npm install openai
npm install clsx tailwind-merge
npm install nuqs  # URL 파라미터 상태 관리 (선택)
```

---

### **Phase 2: 프로젝트 구조 설계 및 타입 정의** (약 1시간)

#### 2.1 폴더 구조 생성
```
src/
├── app/
│   ├── page.tsx                    # 메인 페이지
│   ├── layout.tsx                  # 루트 레이아웃
│   ├── api/
│   │   └── generate/
│   │       └── route.ts            # OpenAI API 라우트
├── components/
│   ├── input-form.tsx              # 입력 폼
│   ├── option-selector.tsx         # 옵션 선택기
│   ├── result-viewer.tsx           # 결과 표시
│   └── generate-button.tsx         # 생성 버튼
├── lib/
│   ├── openai.ts                   # OpenAI 클라이언트
│   ├── prompts.ts                  # 프롬프트 템플릿
│   └── utils.ts                    # 유틸리티 함수
└── types/
    └── index.ts                    # 타입 정의
```

#### 2.2 TypeScript 인터페이스 정의
- `GenerateRequest`: API 요청 타입
- `GeneratedCopy`: 생성된 문구 타입
- `FormOptions`: 폼 옵션 타입
- `Platform`, `Gender`, `AgeRange` 등 열거형 타입

---

### **Phase 3: 백엔드 API 구현** (약 2시간)

#### 3.1 OpenAI 클라이언트 설정 (`lib/openai.ts`)
- OpenAI SDK 초기화
- 에러 핸들링 래퍼 함수 구현
- API 키 검증 로직

#### 3.2 프롬프트 엔지니어링 (`lib/prompts.ts`)
- 플랫폼별 프롬프트 템플릿 작성
  - 인스타그램: 짧고 감성적, 해시태그 중심
  - 유튜브: 서사적, 클릭 유도
  - 페이스북: 커뮤니티 중심, 참여 유도
  - 틱톡: 트렌디, 짧고 강렬
  - 블로그: 상세하고 정보 제공
- 타겟/어조/목적별 프롬프트 최적화
- 다국어 지원 템플릿

#### 3.3 API 라우트 구현 (`app/api/generate/route.ts`)
- POST 요청 핸들러 작성
- 입력 유효성 검증 (Zod 또는 수동 검증)
- OpenAI API 호출
  - Model: `gpt-4` 또는 `gpt-4-turbo`
  - Temperature: 0.7~0.9 (다양성 확보)
  - Max tokens: 플랫폼별 조정
- JSON 응답 포맷팅
- 에러 처리 및 로깅
- Rate limiting 고려

---

### **Phase 4: 프론트엔드 UI 컴포넌트 구현** (약 3시간)

#### 4.1 입력 폼 컴포넌트 (`components/input-form.tsx`)
- Textarea: 가치 제언 입력
  - 최소 10자 / 최대 200자 검증
  - 실시간 글자 수 카운터
  - 필수 입력 validation
- 포커스 상태 스타일링
- 에러 메시지 표시

#### 4.2 옵션 선택기 컴포넌트 (`components/option-selector.tsx`)

##### 기본 옵션
- **성별**: RadioGroup 컴포넌트
  - 남성 / 여성 / 전체
- **연령대**: Select 컴포넌트
  - 10대 / 20대 / 30대 / 40대 / 50대 이상
- **플랫폼**: MultiSelect 또는 Checkbox Group
  - 인스타그램 / 유튜브 / 페이스북 / 틱톡 / 블로그
  - 최소 1개 선택 필수
- **마케팅 목적**: Select 컴포넌트
  - 브랜드 인지도 / 제품 구매 유도 / 이벤트 참여 / 신규 구독자 유입
- **어조 스타일**: Select 컴포넌트
  - 감성적 / 유머러스 / 전문적 / 트렌디 / 진정성 있는
- **생성 분량**: Slider 컴포넌트
  - 1~5개, 기본값 3

##### 고급 옵션 (Collapsible)
- **언어 선택**: Select (한국어 / 영어 / 일본어)
- **톤 강도**: Slider (1: 부드럽게 ~ 5: 강렬하게)
- **해시태그 포함 여부**: Switch/Toggle
- **이모지 포함 여부**: Switch/Toggle

#### 4.3 생성 버튼 컴포넌트 (`components/generate-button.tsx`)
- 로딩 상태 관리 (`isLoading`)
- Loader 스피너 표시 (Lucide React Icons)
- 비활성화 상태 처리
  - 필수 입력값 미입력 시
  - API 호출 중일 때
- 접근성 고려 (aria-label, disabled 속성)

#### 4.4 결과 뷰어 컴포넌트 (`components/result-viewer.tsx`)
- Card 레이아웃으로 결과 표시
- 플랫폼별 문구 구분 표시
  - Badge로 플랫폼 표시
  - 각 문구를 개별 Card로 표시
- JSON Raw 데이터 표시 (토글 가능)
  - 코드 블록 스타일링
- 복사 버튼 기능 (Clipboard API)
  - 개별 문구 복사
  - 전체 JSON 복사
- 에러 메시지 표시
  - Alert 컴포넌트 사용
- 빈 상태(Empty State) 처리

---

### **Phase 5: 메인 페이지 통합** (약 2시간)

#### 5.1 메인 페이지 구현 (`app/page.tsx`)
- 전체 레이아웃 구성
  - 헤더: 서비스 제목 및 설명
  - 입력 섹션: 2열 그리드 (입력폼 | 옵션)
  - 결과 섹션: 전체 너비
- 반응형 디자인
  - 모바일: 1열 스택
  - 태블릿: 1열 스택
  - 데스크톱: 2열 그리드
- 상태 관리
  - `useState`: 폼 데이터
  - `useState`: 생성 결과
  - `useState`: 로딩/에러 상태
- API 호출 로직
  - `fetch` 또는 `axios` 사용
  - 에러 핸들링
  - 타임아웃 처리
- 로딩/에러/성공 상태별 UI 처리
  - 로딩: 스켈레톤 또는 스피너
  - 에러: Toast 또는 Alert
  - 성공: 결과 표시 + 애니메이션

#### 5.2 레이아웃 최적화 (`app/layout.tsx`)
- 메타데이터 수정
  ```typescript
  export const metadata: Metadata = {
    title: "AI 마케팅 문구 자동 생성기",
    description: "OpenAI 기반 타겟 맞춤형 마케팅 카피 생성 서비스",
  };
  ```
- 폰트 최적화 (Google Fonts)
- 다크모드 대응 (next-themes)
- 전역 스타일 설정

---

### **Phase 6: 스타일링 및 UX 개선** (약 2시간)

#### 6.1 Tailwind 커스터마이징
- 커스텀 컬러 팔레트 정의
  ```javascript
  // tailwind.config.ts
  colors: {
    primary: { ... },
    secondary: { ... },
    accent: { ... },
  }
  ```
- 반응형 그리드 레이아웃
- 애니메이션 효과
  - 페이드인/아웃
  - 슬라이드 인
  - 스케일 효과

#### 6.2 UX 개선사항
- **입력값 자동 저장** (localStorage)
  - 페이지 새로고침 시 복원
  - "초기화" 버튼 제공
- **옵션 변경 시 실시간 피드백**
  - 선택된 옵션 하이라이트
  - 미리보기 영역 (선택사항)
- **결과 애니메이션**
  - 생성 완료 시 부드러운 전환
  - 개별 카드 순차 애니메이션
- **스크롤 최적화**
  - 결과 생성 시 자동 스크롤
  - Smooth scroll behavior
- **접근성 개선**
  - ARIA 레이블
  - 키보드 네비게이션
  - 포커스 표시

---

### **Phase 7: 테스트 및 검증** (약 1시간)

#### 7.1 기능 테스트
- 각 옵션 조합별 생성 테스트
  - 플랫폼 조합 테스트
  - 언어별 테스트
  - 어조/톤 강도 테스트
- API 에러 시나리오 테스트
  - 네트워크 오류
  - API 키 오류
  - Rate limit 초과
  - 타임아웃
- 입력 validation 테스트
  - 최소/최대 글자 수
  - 필수 입력 검증
  - 특수문자 처리

#### 7.2 성능 최적화
- **코드 스플리팅**
  - Dynamic import 활용
  - Route-based splitting
- **이미지 최적화**
  - Next.js Image 컴포넌트
  - WebP 포맷
- **API 응답 캐싱** (선택사항)
  - React Query 도입 고려
  - SWR 사용 고려
- **번들 크기 최적화**
  - `npm run build` 분석
  - 불필요한 의존성 제거
- **Lighthouse 점수 확인**
  - Performance: 90+
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 90+

---

### **Phase 8: 배포 준비 및 배포** (약 30분)

#### 8.1 환경 변수 설정
- Vercel 프로젝트 생성
- 환경 변수 등록
  ```
  OPENAI_API_KEY=your_production_key
  ```
- 환경별 변수 분리 (Development / Production)

#### 8.2 프로덕션 빌드 테스트
```bash
npm run build
npm run start
```
- 빌드 에러 확인
- 프로덕션 모드 동작 검증
- 환경 변수 로드 확인

#### 8.3 배포
- Vercel에 배포
  ```bash
  vercel --prod
  ```
- 또는 GitHub 연동 자동 배포
- 배포 후 동작 확인
  - API 호출 테스트
  - 전체 플로우 검증
- 도메인 설정 (선택사항)
  - 커스텀 도메인 연결
  - SSL 인증서 확인

---

### 📊 예상 소요 시간 및 우선순위

| Phase | 내용 | 소요 시간 | 우선순위 |
|-------|------|-----------|----------|
| Phase 1 | 개발 환경 구축 | 30분 | ⭐⭐⭐⭐⭐ |
| Phase 2 | 구조 설계 및 타입 정의 | 1시간 | ⭐⭐⭐⭐⭐ |
| Phase 3 | 백엔드 API 구현 | 2시간 | ⭐⭐⭐⭐⭐ |
| Phase 4 | 프론트엔드 UI 구현 | 3시간 | ⭐⭐⭐⭐ |
| Phase 5 | 메인 페이지 통합 | 2시간 | ⭐⭐⭐⭐ |
| Phase 6 | 스타일링 및 UX 개선 | 2시간 | ⭐⭐⭐ |
| Phase 7 | 테스트 및 검증 | 1시간 | ⭐⭐⭐ |
| Phase 8 | 배포 준비 및 배포 | 30분 | ⭐⭐⭐ |
| **총계** | **전체 개발** | **12~15시간** | - |

---

### 🎯 개발 진행 방식

#### 옵션 1: 전체 자동 구현
- 모든 Phase를 순차적으로 자동 구현
- 각 단계마다 코드 리뷰 포인트 표시
- 완료 후 전체 테스트

#### 옵션 2: 단계별 구현
- Phase 1부터 순차적 진행
- 각 단계 완료 시 확인 및 피드백
- 유연한 수정 가능

#### 옵션 3: 특정 단계만 구현
- 필요한 Phase 선택 구현
- 기존 코드베이스와 통합
- 커스터마이징 중점

---

### 📝 개발 체크리스트

#### Phase 1 완료 조건
- [ ] Shadcn UI 설치 완료
- [ ] 필수 컴포넌트 설치 완료
- [ ] 환경 변수 설정 완료
- [ ] 추가 의존성 설치 완료

#### Phase 2 완료 조건
- [ ] 폴더 구조 생성 완료
- [ ] TypeScript 인터페이스 정의 완료
- [ ] 유틸리티 함수 구현 완료

#### Phase 3 완료 조건
- [ ] OpenAI 클라이언트 설정 완료
- [ ] 프롬프트 템플릿 작성 완료
- [ ] API 라우트 구현 및 테스트 완료

#### Phase 4 완료 조건
- [ ] 입력 폼 컴포넌트 완성
- [ ] 옵션 선택기 완성
- [ ] 생성 버튼 완성
- [ ] 결과 뷰어 완성

#### Phase 5 완료 조건
- [ ] 메인 페이지 레이아웃 완성
- [ ] 상태 관리 구현 완료
- [ ] API 통합 완료
- [ ] 반응형 디자인 적용 완료

#### Phase 6 완료 조건
- [ ] 스타일링 완료
- [ ] UX 개선사항 적용 완료
- [ ] 애니메이션 적용 완료

#### Phase 7 완료 조건
- [ ] 기능 테스트 통과
- [ ] 성능 최적화 완료
- [ ] Lighthouse 점수 목표 달성

#### Phase 8 완료 조건
- [ ] 프로덕션 빌드 성공
- [ ] Vercel 배포 완료
- [ ] 배포 환경 동작 검증 완료

---
# ai_mkt_app
