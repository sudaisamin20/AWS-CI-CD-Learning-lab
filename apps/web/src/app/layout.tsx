import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS CI/CD Learning Lab",
  description: "A starter project for learning CI/CD on AWS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
