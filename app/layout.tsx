import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🌤️ WeatherPro - Advanced Weather Insights",
  description: "🌍 Get real-time weather data, forecasts, and detailed conditions for any location worldwide. Your comprehensive weather companion with location-based detection.",
  keywords: "weather, forecast, temperature, humidity, wind, UV index, weather app",
  authors: [{ name: "WeatherPro Team" }],
  icons: {
    icon: [
      { url: "/weather-icon.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" }
    ]
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "🌤️ WeatherPro - Advanced Weather Insights",
    description: "🌍 Real-time weather data and forecasts for any location worldwide",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "🌤️ WeatherPro - Advanced Weather Insights",
    description: "🌍 Real-time weather data and forecasts for any location worldwide"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
