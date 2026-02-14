import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Providers } from "@/components/providers";
import "swiper/css";
import "swiper/css/pagination";

export const metadata = {
  title: "Gaurav Dadhich | Portfolio",
  description: "Portfolio of Gaurav Dadhich, a Full Stack Developer",
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 5,
  //   viewportFit: "cover",
  // },
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  //   { media: "(prefers-color-scheme: dark)", color: "#000000" },
  // ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
          }
          
          @media (max-width: 640px) {
            html {
              font-size: 16px;
            }
          }
        `}</style>
      </head>
      <body className="dark overflow-x-hidden">
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
            <ScrollToTop />
            <Toaster position="bottom-right" theme="dark" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
