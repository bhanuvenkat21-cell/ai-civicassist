import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI CivicAssist",
    short_name: "CivicAssist",
    description:
      "Find Andhra Pradesh government schemes and services, with document checklists and step-by-step guidance.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F6FA",
    theme_color: "#1F3A8A",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
