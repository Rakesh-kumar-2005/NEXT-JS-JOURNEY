import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import FloatingShapes from "@/components/floating-shapes";
import Header from "@/components/header";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pixxel",
  description: "AI Image Editor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider appearance={{
            baseTheme: shadesOfPurple,
          }}>

          <ConvexClientProvider>
            <Header className="" />
            <main className="bg-slate-900 min-h-screen text-white overflow-x-hidden">
              <FloatingShapes />
              <Toaster richColors />
              {children}
            </main>
          </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
