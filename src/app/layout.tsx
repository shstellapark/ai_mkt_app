import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 마케팅 문구 생성기 | OpenAI 기반 마케팅 카피 생성",
  description: "타겟과 플랫폼에 최적화된 마케팅 문구를 AI가 자동으로 생성합니다. 인스타그램, 유튜브, 틱톡 등 다양한 플랫폼을 지원합니다.",
  keywords: ["AI", "마케팅", "문구 생성", "카피라이팅", "OpenAI", "GPT"],
  authors: [{ name: "AI Marketing Team" }],
  openGraph: {
    title: "AI 마케팅 문구 생성기",
    description: "OpenAI 기반 타겟 맞춤형 마케팅 카피 생성 서비스",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
