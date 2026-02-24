import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Servd - AI Recipe Platform",
  description: "AI powered recipe generation platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme:neobrutalism}}>

  
    <html lang="en">
      <body className={inter.className}>
        <Header>

        </Header>
        <main className="min-h-screen">
        {children}
        </main>
        <Toaster richColors>
       <footer className="py-8 px-4 border-t">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Servd Logo"
                  width={48}
                  height={48}
                  className="w-14"
                />
              </div>
              <p className="text-stone-500 text-sm">
                Made 💗 by Abhishek Bhardwaj
              </p>
            </div>
          </footer>
          </Toaster>
      </body>
    </html>
    </ClerkProvider>
  );
}
