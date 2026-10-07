import income from "@/data/income_certificate.json";
import scholarship from "@/data/ap_jnanabhumi_scholarship.json";
import caste from "@/data/ap_caste_certificate.json";
import vaidya from "@/data/ap_ntr_vaidya_seva.json";
import pension from "@/data/ap_ntr_bharosa_pension.json";
import annadata from "@/data/ap_annadata_sukhibhava.json";

export type Lang = "en" | "te" | "hi";

export interface Doc {
  name: string;
  why?: string;
  if_missing?: string;
  linked_service?: string;
}

export interface Service {
  id: string;
  name: Record<Lang, string>;
  category: string;
  level: string;
  summary?: string;
  documents: Doc[];
  steps: string[];
  official_links?: { label: string; url: string }[];
  verification?: {
    content_verified: boolean;
    last_verified: string | null;
    open_items?: string[];
  };
}

export const services = [
  income,
  scholarship,
  caste,
  vaidya,
  pension,
  annadata,
] as unknown as Service[];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

// Simple keyword matching (English, Telugu, Hindi). Gemini will replace this later.
const keywords: Record<string, string[]> = {
  "ap-income-certificate": ["income certificate", "income proof", "income", "ఆదాయ", "आय"],
  "ap-caste-certificate": ["caste", "community", "nativity", "integrated certificate", "కుల", "जाति"],
  "ap-jnanabhumi-scholarship": [
    "scholarship", "fee reimbursement", "jnanabhumi", "student", "btech", "b.tech",
    "college fee", "స్కాలర్", "छात्रवृत्ति",
  ],
  "ap-ntr-vaidya-seva": [
    "aarogyasri", "arogyasri", "vaidya seva", "health", "hospital", "treatment",
    "insurance", "ఆరోగ్య", "आरोग्य", "स्वास्थ्य",
  ],
  "ap-ntr-bharosa-pension": [
    "pension", "widow", "old age", "disabled", "disability", "bharosa", "పెన్షన్", "పింఛన్", "पेंशन",
  ],
  "ap-annadata-sukhibhava": [
    "farmer", "annadata", "sukhibhava", "kisan", "agriculture", "రైతు", "అన్నదాత", "किसान",
  ],
};

export function findServices(query: string): Service[] {
  const q = query.toLowerCase();
  const scored = services
    .map((s) => ({
      s,
      score: (keywords[s.id] ?? []).filter((k) => q.includes(k.toLowerCase())).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((x) => x.s);
}
