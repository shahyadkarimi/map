import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import "../css/style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Map",
  description: "Map Selector by shahyad karimi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
