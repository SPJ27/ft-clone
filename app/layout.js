import { Jua } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const jua = Jua({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})
export const metadata = {
  title: "Flavortown!",
  description: "Not a YSWS, It is just a clone of Flavortown for Macondo. Made by @spj... thanks :)",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en" className={`h-full ${jua.className} antialiased`}>
      <body className="h-full" style={{
        backgroundColor: "#e7d4b1",
        backgroundImage: `url("/bg-01.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: 'jua'
      }}>
        <div className="flex h-screen">
          <Sidebar />

          <main className="pb-30 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}