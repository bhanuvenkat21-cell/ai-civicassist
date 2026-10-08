"use client";

import { useRef, useEffect, useState } from "react";
import { findServices, getService, type Lang } from "@/lib/services";

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
}

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
    install: "Install app",
    popular: "Popular services",
    ready: "ready",
    verifiedBadge: "Verified",
    unverifiedBadge: "Needs official confirmation",
    trust: "Answers come only from our AP services data",
    prompts: ["I need a scholarship", "Pension for my mother", "Help for farmers"],
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
    install: "యాప్ ఇన్‌స్టాల్ చేయండి",
    popular: "ప్రముఖ సేవలు",
    ready: "సిద్ధం",
    verifiedBadge: "ధృవీకరించబడింది",
    unverifiedBadge: "అధికారిక నిర్ధారణ అవసరం",
    trust: "సమాధానాలు మా ఏపీ సేవల డేటా నుండి మాత్రమే",
    prompts: ["స్కాలర్‌షిప్ కావాలి", "అమ్మకు పెన్షన్", "రైతు సహాయం"],
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
    install: "ऐप इंस्टॉल करें",
    popular: "लोकप्रिय सेवाएँ",
    ready: "तैयार",
    verifiedBadge: "सत्यापित",
    unverifiedBadge: "आधिकारिक पुष्टि आवश्यक",
    trust: "उत्तर केवल हमारे आंध्र प्रदेश सेवा डेटा से",
    prompts: ["मुझे छात्रवृत्ति चाहिए", "माँ के लिए पेंशन", "किसान सहायता"],
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

const ICON: Record<string, string> = {
  Education: "🎓", Certificates: "📄", Health: "🏥", Welfare: "🤝", Agriculture: "🌾",
};

const SHORT: Record<string, Record<Lang, string>> = {
  "ap-jnanabhumi-scholarship": { en: "Scholarship", te: "స్కాలర్‌షిప్", hi: "छात्रवृत्ति" },
  "ap-income-certificate": { en: "Income certificate", te: "ఆదాయ ధృవపత్రం", hi: "आय प्रमाणपत्र" },
  "ap-caste-certificate": { en: "Caste certificate", te: "కుల ధృవపత్రం", hi: "जाति प्रमाणपत्र" },
  "ap-ntr-vaidya-seva": { en: "Aarogyasri health", te: "ఆరోగ్యశ్రీ", hi: "आरोग्यश्री" },
  "ap-ntr-bharosa-pension": { en: "Pension", te: "పెన్షన్", hi: "पेंशन" },
  "ap-annadata-sukhibhava": { en: "Farmer support", te: "రైతు సహాయం", hi: "किसान सहायता" },
};

function Detail({ id, lang, onOpen }: { id: string; lang: Lang; onOpen: (id: string) => void }) {
  const s = getService(id);
  const t = T[lang];
  const [done, setDone] = useState<Record<number, boolean>>({});
  if (!s) return null;
  const link = s.official_links?.[0];
  const count = Object.values(done).filter(Boolean).length;
  const total = s.documents.length;
  const pct = total ? Math.round((count / total) * 100) : 0;
  const verified = !!s.verification?.content_verified;
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8EDFA] text-2xl">
          {ICON[s.category] ?? "📌"}
        </div>
        <div>
          <div className="text-base leading-snug font-bold">{s.name[lang] ?? s.name.en}</div>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {verified ? t.verifiedBadge : t.unverifiedBadge}
          </span>
        </div>
      </div>
      {s.summary && <p className="text-sm leading-relaxed text-slate-600">{s.summary}</p>}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">{t.docs}</span>
          <span className="text-xs font-semibold text-[#1F3A8A]">{count}/{total} {t.ready}</span>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-[#1F3A8A] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <ul className="space-y-2">
          {s.documents.map((d, i) => (
            <li key={d.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!done[i]}
                  onChange={() => setDone((p) => ({ ...p, [i]: !p[i] }))}
                  className="mt-0.5 h-5 w-5 accent-[#1F3A8A]"
                />
                <span>
                  <span className={`font-semibold ${done[i] ? "text-slate-400 line-through" : ""}`}>{d.name}</span>
                  {d.why && <span className="block text-slate-500">{d.why}</span>}
                </span>
              </label>
              {d.linked_service && getService(d.linked_service) && (
                <button
                  onClick={() => onOpen(d.linked_service as string)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-[#1F3A8A] px-3 text-sm font-semibold text-[#1F3A8A] active:bg-[#E8EDFA]"
                >
                  {t.missing} →
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">{t.steps}</div>
        <ol className="space-y-0">
          {s.steps.map((st, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1F3A8A] text-xs font-bold text-white">
                  {i + 1}
                </span>
                {i < s.steps.length - 1 && <span className="my-1 w-0.5 flex-1 bg-[#C9D3F0]" />}
              </div>
              <span className="pb-4 text-sm leading-relaxed">{st}</span>
            </li>
          ))}
        </ol>
      </div>

      {link ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center rounded-xl bg-[#F4A62A] font-bold text-slate-900 shadow-sm active:opacity-90"
        >
          {t.portal} ↗
        </a>
      ) : (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{t.noLink}</div>
      )}
      {!verified && <div className="text-xs leading-relaxed text-slate-500">{t.verify}</div>}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [installEvt, setInstallEvt] = useState<InstallEvent | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const t = T[lang];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function send(text?: string) {
    const q = (text ?? input).trim();
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
      <header className="bg-gradient-to-br from-[#1F3A8A] to-[#2F55C8] px-5 pt-5 pb-5 text-white">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold">{t.title}</h1>
          <div className="flex rounded-full bg-white/15 p-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`h-9 min-w-11 rounded-full px-3 text-sm font-bold ${
                  lang === l.code ? "bg-white text-[#1F3A8A]" : "text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm text-[#D5DCF5]">{t.sub}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs">
          <span>🛡️</span>
          <span>{t.trust}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <section className="px-4 pt-4">
          <div className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">{t.popular}</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(SHORT).map((id) => {
              const s = getService(id);
              if (!s) return null;
              return (
                <button
                  key={id}
                  onClick={() => openService(id)}
                  className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm active:bg-[#E8EDFA]"
                >
                  <span className="text-2xl">{ICON[s.category] ?? "📌"}</span>
                  <span className="text-sm leading-tight font-semibold">{SHORT[id][lang]}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="space-y-3 p-4">
          <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm shadow-sm">{t.welcome}</div>

          {msgs.map((m, i) => {
            if (m.role === "user")
              return (
                <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#1F3A8A] p-3 text-sm text-white shadow-sm">
                  {m.text}
                </div>
              );
            if (m.role === "bot")
              return (
                <div key={i} className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white p-3 text-sm shadow-sm">
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
                          className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-sm font-semibold active:bg-[#E8EDFA]"
                        >
                          <span className="text-xl">{ICON[s.category] ?? "📌"}</span>
                          <span className="flex-1">{s.name[lang] ?? s.name.en}</span>
                          <span className="text-xs font-bold text-[#1F3A8A]">{t.view} →</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            return (
              <div key={i} className="rounded-2xl rounded-bl-sm bg-white p-4 shadow-sm">
                <Detail id={m.id} lang={lang} onOpen={openService} />
              </div>
            );
          })}

          {loading && (
            <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white p-3 text-sm text-slate-500 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#1F3A8A]" />
              {t.thinking}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white px-3 pt-2 pb-3">
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          {t.prompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              disabled={loading}
              className="shrink-0 rounded-full border border-[#C9D3F0] bg-[#F3F6FA] px-3 py-1.5 text-xs font-semibold text-[#1F3A8A] disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            className="h-12 flex-1 rounded-full border border-slate-300 bg-[#F8FAFC] px-4 text-sm outline-none focus:border-[#1F3A8A]"
          />
          <button
            onClick={() => send()}
            disabled={loading}
            className="h-12 rounded-full bg-[#F4A62A] px-5 text-sm font-bold text-slate-900 shadow-sm disabled:opacity-50"
          >
            {t.send}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-500">{t.privacy}</p>
        {installEvt && (
          <div className="mt-2 text-center">
            <button
              onClick={async () => {
                await installEvt.prompt();
                setInstallEvt(null);
              }}
              className="min-h-11 rounded-full border border-[#1F3A8A] px-4 text-sm font-bold text-[#1F3A8A]"
            >
              {t.install}
            </button>
          </div>
        )}
      </footer>
    </main>
  );
}
