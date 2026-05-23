import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Hanken_Grotesk, Playfair_Display } from "next/font/google";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Providers } from "@/components/providers";
import "swiper/css";
import "swiper/css/pagination";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${playfairDisplay.variable} scroll-smooth`}
    >
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="dark overflow-x-hidden bg-background font-sans text-foreground antialiased">
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
