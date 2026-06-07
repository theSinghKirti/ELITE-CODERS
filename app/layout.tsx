import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MediVoice AI — Your AI Medical Assistant",
  description: "Describe your symptoms naturally. Get evidence-based guidance in seconds using our secure clinical AI interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased font-sans min-h-screen bg-slate-50 text-slate-900`}>
        
        {/* Global disclaimer banner at top: fixed thin bar, teal background */}
        <div className="fixed top-0 left-0 right-0 z-100 flex items-center justify-center gap-2 bg-[#14b8a6] px-4 py-2.5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white shadow-md select-none">
          <span>Demo app for educational/hackathon purposes only. Always consult a licensed healthcare professional.</span>
        </div>

        <div className="pt-10">
          {children}
        </div>
      </body>
    </html>
  );
}
