import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "v2 · Wireframes",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geist.variable} ${jetBrainsMono.variable}`}>{children}</div>
  );
}
