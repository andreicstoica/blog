import "./global.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import BlindsBackground from "./components/background";
import { ThemeProvider } from "./components/theme-provider";
import { baseUrl } from "./sitemap";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Andrei's Blog",
    template: "Andrei's Blog",
  },
  description: "This is my blog.",
  openGraph: {
    title: "Andrei Stoica blog",
    description: "Andrei Stoica's is my blog.",
    url: baseUrl,
    siteName: "Andrei Stoica's blog",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(ibmPlexSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <BlindsBackground />
          <main className="flex flex-col flex-1 items-center justify-center min-h-screen px-2 md:px-0">
            <Navbar />
            <div className="w-full max-w-2xl flex flex-col items-center">
              {children}
            </div>
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
