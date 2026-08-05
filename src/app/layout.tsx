import type { Metadata } from "next";
import "./globals.css";
import { ContactBar } from "@/components/layout/ContactBar";
import { LanguageProvider } from "@/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "Portfolio | Pathology",
  description: "A portfolio exploring recursive structures, memory systems, and the pathology of choice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono antialiased bg-stone-950 text-stone-300">
        <LanguageProvider>
          <ContactBar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
