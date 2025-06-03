import localFont from "next/font/local"
import { Space_Grotesk } from "next/font/google"

export const audyno = localFont({
  src: "../public/fonts/audyno.otf",
  variable: "--font-audyno",
  display: "swap",
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
}) 