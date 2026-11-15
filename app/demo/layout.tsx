import { Barlow_Condensed, Fraunces, Manrope } from "next/font/google";

// Display fonts used only by the demo sites, so the landing page stays light.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"] });
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "800"] });
const jakarta = Manrope({ variable: "--font-jakarta", subsets: ["latin"] });

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${fraunces.variable} ${barlow.variable} ${jakarta.variable}`}>{children}</div>;
}
