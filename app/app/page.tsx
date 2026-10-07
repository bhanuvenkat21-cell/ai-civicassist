"use client";

import { useRef, useEffect, useState } from "react";
import { findServices, getService, type Lang } from "@/lib/services";

type Msg =
  | { role: "user"; text: string }
  | { role: "bot"; text: string }
  | { role: "bot-matches"; ids: string[] }
  | { role: "bot-detail"; id: string };

const T = {
  en: {
    title: "AI CivicAssist",
    sub: "Find schemes and services you qualify for",
    welcome:
      "Hello! Tell me what you need: a scholarship, certificate, pension, health cover or farmer support.",
    placeholder: "Ask in English, Telugu or Hindi",
    send: "Send",
    privacy: "Please do not type Aadhaar numbers or other personal details.",
    thinking: "Thinking...",
    notFound:
      "I could not find a matching service yet. Try words like scholarship, income certificate, caste certificate, pension, Aarogyasri or farmer.",
    found: "I found these services for you:",
    view: "View details",
    docs: "Documents you need",
    steps: "How to apply",
    missing: "Don't have it? See how to get it",
    portal: "Open official portal",
    noLink: "Official link not confirmed yet. Check the AP Seva portal.",
    verify:
      "These details come from guide sources and are not yet verified. Please confirm on the official portal.",
  },
  te: {
    title: "AI సివిక్ అసిస్ట్",
    sub: "మీకు అర్హత ఉన్న పథకాలు మరియు సేవలను కనుగొనండి",
    welcome:
      "నమస్కారం! మీకు ఏమి కావాలో చెప్పండి: స్కాలర్‌షిప్, సర్టిఫికేట్, పెన్షన్, ఆరోగ్య సేవ లేదా రైతు సహాయం.",
    placeholder: "తెలుగు, ఇంగ్లీష్ లేదా హిందీలో అడగండి",
    send: "పంపు",
    privacy: "ఆధార్ నంబర్ లేదా ఇతర వ్యక్తిగత వివరాలు టైప్ చేయవద్దు.",
    thinking: "ఆలోచిస్తున్నాను...",
    notFound:
      "సరిపోయే సేవ ఇంకా కనబడలేదు. స్కాలర్‌షిప్, ఆదాయ ధృవపత్రం, కుల ధృవపత్రం, పెన్షన్, ఆరోగ్యశ్రీ లేదా రైతు వంటి పదాలు ప్రయత్నించండి.",
    found: "మీ కోసం ఈ సేవలు కనుగొన్నాను:",
    view: "వివరాలు చూడండి",
    docs: "మీకు కావలసిన పత్రాలు",
    steps: "ఎలా దరఖాస్తు చేయాలి",
    missing: "లేదా? ఎలా పొందాలో చూడండి",
    portal: "అధికారిక పోర్టల్ తెరవండి",
    noLink: "అధికారిక లింక్ ఇంకా నిర్ధారించలేదు. AP సేవ పోర్టల్ చూడండి.",
    verify:
      "ఈ వివరాలు గైడ్ మూలాల నుండి వచ్చాయి మరియు ఇంకా ధృవీకరించబడలేదు. దయచేసి అధికారిక పోర్టల్‌లో నిర్ధారించుకోండి.",
  },
  hi: {
    title: "AI सिविक असिस्ट",
    sub: "अपने लिए योग्य योजनाएँ और सेवाएँ खोजें",
    welcome:
      "नमस्ते! बताइए आपको क्या चाहिए: छात्रवृत्ति, प्रमाणपत्र, पेंशन, स्वास्थ्य सहायता या किसान सहायता।",
    placeholder: "हिंदी, तेलुगु या अंग्रेज़ी में पूछें",
    send: "भेजें",
    privacy: "कृपया आधार नंबर या अन्य निजी जानकारी न लिखें।",
    thinking: "सोच रहा हूँ...",
    notFound:
      "अभी कोई मिलती-जुलती सेवा नहीं मिली। छात्रवृत्ति, आय प्रमाणपत्र, जाति प्रमाणपत्र, पेंशन, आरोग्यश्री या किसान जैसे शब्द आज़माएँ।",
    found: "आपके लिए ये सेवाएँ मिलीं:",
    view: "विवरण देखें",
    docs: "आवश्यक दस्तावेज़",
    steps: "आवेदन कैसे करें",
    missing: "नहीं है? कैसे बनवाएँ देखें",
    portal: "आधिकारिक पोर्टल खोलें",
    noLink: "आधिकारिक लिंक अभी पुष्ट नहीं है। AP सेवा पोर्टल देखें।",
    verify:
      "ये विवरण गाइड स्रोतों से हैं और अभी सत्यापित नहीं हैं। कृपया आधिकारिक पोर्टल पर पुष्टि करें।",
  },
} as const;

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "te", label: "తె" },
  { code: "hi", label: "हि" },
];

function Detail({ id, lang, onOpen }: { id: string; lang: Lang; onOpen: (id: string) => void }) {
  const s = getService(id);
  const t = T[lang];
  if (!s) return null;
  const link = s.official_links?.[0];
  return (
    <div className="space-y-3">
      <div className="text-base font-bold">{s.name[lang] ?? s.name.en}</div>
      {s.summary && <p className="text-sm text-slate-600">{s.summary}</p>}

      <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.docs}</div>
      <ul className="space-y-2">
        {s.documents.map((d) => (
          <li key={d.name} className="rounded-lg bg-slate-50 p-3 text-sm">
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 h-4 w-4" />
              <span>
                <span className="font-semibold">{d.name}</span>
                {d.why && <span className="block text-slate-500">{d.why}</span>}
              </span>
            </label>
            {d.linked_service && getService(d.linked_service) && (
              <button
                onClick={() => onOpen(d.linked_service as string)}
                className="mt-2 min-h-11 rounded-lg border border-[#1F3A8A] px-3 text-sm font-semibold text-[#1F3A8A]"
              >
                {t.missing}
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.steps}</div>
      <ol className="space-y-2">
        {s.steps.map((st, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1F3A8A] text-xs font-bold text-white">
              {i + 1}
            </span>
            <span>{st}</span>
          </li>
        ))}
      </ol>

      {link ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center rounded-xl bg-[#F4A62A] font-bold text-slate-900"
        >
          {t.portal}
        </a>
      ) : (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{t.noLink}</div>
      )}

      {!s.verification?.content_verified && (
        <div className="text-xs text-slate-500">{t.verify}</div>
      )}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const t = T[lang];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, lang }),
      });
      const data = await res.json();
      const ids: string[] = Array.isArray(data.ids) ? data.ids : [];
      const next: Msg[] = [];
      if (data.reply) next.push({ role: "bot", text: data.reply });
      if (ids.length > 0) next.push({ role: "bot-matches", ids });
      if (next.length === 0) next.push({ role: "bot", text: t.notFound });
      setMsgs((m) => [...m, ...next]);
    } catch {
      const found = findServices(q).map((s) => s.id);
      const fb: Msg =
        found.length > 0
          ? { role: "bot-matches", ids: found }
          : { role: "bot", text: t.notFound };
      setMsgs((m) => [...m, fb]);
    } finally {
      setLoading(false);
    }
  }

  function openService(id: string) {
    setMsgs((m) => [...m, { role: "bot-detail", id }]);
  }

  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col bg-[#F3F6FA] text-[#14213D]">
      <header className="bg-[#1F3A8A] px-5 pt-5 pb-4 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t.title}</h1>
          <div className="flex gap-1.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`h-11 min-w-11 rounded-lg border px-2 text-sm font-bold ${
                  lang === l.code
                    ? "border-white bg-white text-[#1F3A8A]"
                    : "border-[#8FA0D6] text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm text-[#D5DCF5]">{t.sub}</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm shadow-sm">
          {t.welcome}
        </div>

        {msgs.map((m, i) => {
          if (m.role === "user")
            return (
              <div
                key={i}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#1F3A8A] p-3 text-sm text-white"
              >
                {m.text}
              </div>
            );
          if (m.role === "bot")
            return (
              <div key={i} className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm shadow-sm">
                {m.text}
              </div>
            );
          if (m.role === "bot-matches")
            return (
              <div key={i} className="rounded-2xl rounded-bl-sm bg-white p-3 shadow-sm">
                <div className="mb-2 text-sm">{t.found}</div>
                <div className="space-y-2">
                  {m.ids.map((id) => {
                    const s = getService(id);
                    if (!s) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => openService(id)}
                        className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-left text-sm font-semibold hover:bg-slate-50"
                      >
                        <span>{s.name[lang] ?? s.name.en}</span>
                        <span className="text-xs font-bold text-[#1F3A8A]">{t.view}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          return (
            <div key={i} className="rounded-2xl rounded-bl-sm bg-white p-3 shadow-sm">
              <Detail id={m.id} lang={lang} onOpen={openService} />
            </div>
          );
        })}
        {loading && (
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm text-slate-500 shadow-sm">
            {t.thinking}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className="h-12 flex-1 rounded-full border border-slate-300 px-4 text-sm"
        />
        <button
          onClick={send}
          disabled={loading}
          className="h-12 rounded-full bg-[#F4A62A] px-5 text-sm font-bold text-slate-900 disabled:opacity-50"
        >
          {t.send}
        </button>
      </div>
      <p className="bg-white px-4 pb-3 text-center text-xs text-slate-500">{t.privacy}</p>
    </main>
  );
}
