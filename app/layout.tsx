import type { Metadata } from "next";
import { Nunito, Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import { cn } from "@/lib/utils";
import ContextProvider from "./providers/ContextProvider";
import { Toaster } from "react-hot-toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Take multiple quizes and see your results.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        nunito.className,
        "font-sans",
        geist.variable,
      )}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css"
          integrity="sha512-QeR2VH+lsBE5LSAe1Q5EnTBbe7XTBubt8dG93Y7gidSgdMCr8nVqKcfKAMyN96SV8KDbZVTDXChatu5G2KQGzg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <ClerkProvider>
        <ContextProvider>
          <body className="min-h-full flex flex-col">
            <Toaster position="top-center" />
            <Header />
            <main className="py-8 mx-60 xl:mx-100 h-full">{children}</main>
          </body>
        </ContextProvider>
      </ClerkProvider>
    </html>
  );
}
