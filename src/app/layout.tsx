import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chief's Custom Calls",
  description:
    "Handcrafted turkey, duck, and deer calls — veteran owned, built in Georgia, USA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
