import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dict, months } from "./i18n-dict";

export type Lang = "en" | "pt" | "zh";
export type Theme = "light" | "dark";

export function translate(src: string, lang: Lang): string {
  if (lang === "en") return src;
  const m = src.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  const core = m[2];
  if (!core) return src;
  const out = translateCore(core, lang);
  return out === null ? src : m[1] + out + m[3];
}

function translateCore(s: string, lang: Lang): string | null {
  const i = lang === "pt" ? 0 : 1;
  const hit = dict[s];
  if (hit) return hit[i];
  // Dates: "Oct 15", "Oct 15, 11:46", "Aug 02, 2026"
  const d = s.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})(?:, (\d{1,2}:\d{2}|\d{4}))?$/);
  if (d) {
    const mo = months[d[1]!]![i];
    const day = String(Number(d[2]));
    const tail = d[3];
    if (lang === "pt") return `${day} ${mo}${tail ? (tail.includes(":") ? ", " : " ") + tail : ""}`;
    const isYear = tail && !tail.includes(":");
    return `${isYear ? tail + "年" : ""}${mo}月${day}日${tail && !isYear ? " " + tail : ""}`;
  }
  let r: RegExpMatchArray | null;
  if ((r = s.match(/^Page (\d+) of (\d+)$/))) return lang === "pt" ? `Página ${r[1]} de ${r[2]}` : `第 ${r[1]} / ${r[2]} 页`;
  if ((r = s.match(/^(\d[\d,]*) results$/))) return lang === "pt" ? `${r[1]} resultados` : `${r[1]} 条结果`;
  if ((r = s.match(/^(\d[\d,]*) rows · CSV will be emailed\.$/))) return lang === "pt" ? `${r[1]} linhas · o CSV será enviado por e-mail.` : `${r[1]} 行 · CSV 将通过邮件发送。`;
  if ((r = s.match(/^Routing to (.+) via Pix\.$/))) return lang === "pt" ? `Enviando para ${r[1]} via Pix.` : `正在通过 Pix 转给 ${r[1]}。`;
  if ((r = s.match(/^Switched to (live|sandbox) environment$/))) return lang === "pt" ? `Ambiente alterado para ${dict[r[1]!]![0]}` : `已切换到${dict[r[1]!]![1]}环境`;
  if ((r = s.match(/^(.+) rail selected$/))) return lang === "pt" ? `Trilho ${r[1]} selecionado` : `已选择 ${r[1]} 通道`;
  if ((r = s.match(/^Window Oct 15 · (.+) entries$/))) return lang === "pt" ? `Janela 15 out · ${r[1]} lançamentos` : `10月15日窗口 · ${r[1]} 条记录`;
  if ((r = s.match(/^(.+) — Odyssey Core$/))) { const t = dict[r[1]!]; return t ? `${t[i]} — Odyssey Core` : null; }
  if ((r = s.match(/^(\d[\d,.]*) \/ day$/))) return lang === "pt" ? `${r[1]} / dia` : `${r[1]} / 天`;
  return null;
}

// ---- DOM translator: keeps every rendered string (including toasts, charts, dialogs) in the chosen language.
const ATTRS = ["placeholder", "aria-label", "title"];
const textOrig = new WeakMap<Text, string>();
const textLast = new WeakMap<Text, string>();
const attrOrig = new WeakMap<Element, Record<string, { o: string; l: string }>>();
const SKIP = new Set(["SCRIPT", "STYLE", "PRE", "CODE", "TEXTAREA"]);

function skip(el: Element | null) {
  for (let e = el; e; e = e.parentElement) if (SKIP.has(e.tagName) || e.hasAttribute("data-no-translate")) return true;
  return false;
}

function doText(n: Text, lang: Lang) {
  if (skip(n.parentElement)) return;
  const cur = n.nodeValue ?? "";
  if (textLast.get(n) !== cur) textOrig.set(n, cur);
  const out = translate(textOrig.get(n)!, lang);
  if (out !== cur) n.nodeValue = out;
  textLast.set(n, out);
}

function doAttrs(el: Element, lang: Lang) {
  for (const a of ATTRS) {
    const cur = el.getAttribute(a);
    if (cur == null) continue;
    let rec = attrOrig.get(el);
    if (!rec) attrOrig.set(el, (rec = {}));
    if (!rec[a] || rec[a].l !== cur) rec[a] = { o: cur, l: cur };
    const out = translate(rec[a].o, lang);
    rec[a].l = out;
    if (out !== cur) el.setAttribute(a, out);
  }
}

function walk(root: Node, lang: Lang) {
  if (root.nodeType === 3) return doText(root as Text, lang);
  if (root.nodeType !== 1) return;
  const el = root as Element;
  if (SKIP.has(el.tagName)) return;
  doAttrs(el, lang);
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n: Node | null;
  while ((n = w.nextNode())) n.nodeType === 3 ? doText(n as Text, lang) : doAttrs(n as Element, lang);
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; theme: Theme; setTheme: (t: Theme) => void };
const PrefsCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, theme: "light", setTheme: () => {} });
export const usePrefs = () => useContext(PrefsCtx);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangS] = useState<Lang>("en");
  const [theme, setThemeS] = useState<Theme>("light");

  useEffect(() => {
    const h = document.documentElement;
    setLangS((h.dataset["lang"] as Lang) || "en");
    setThemeS(h.classList.contains("dark") ? "dark" : "light");
  }, []);

  useEffect(() => {
    const h = document.documentElement;
    h.dataset["lang"] = lang;
    h.lang = lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : "en";
    walk(document.documentElement, lang);
    h.classList.remove("i18n-pending");
    const obs = new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === "characterData") doText(m.target as Text, lang);
        else if (m.type === "attributes") doAttrs(m.target as Element, lang);
        else m.addedNodes.forEach((n) => walk(n, lang));
      }
    });
    obs.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    return () => obs.disconnect();
  }, [lang]);

  const setLang = (l: Lang) => { localStorage.setItem("lang", l); setLangS(l); };
  const setTheme = (t: Theme) => {
    localStorage.setItem("theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
    setThemeS(t);
  };
  return <PrefsCtx.Provider value={{ lang, setLang, theme, setTheme }}>{children}</PrefsCtx.Provider>;
}

// Runs before paint: applies saved theme (default light) and language (saved, else browser).
export const prefsBootScript = `(function(){try{var h=document.documentElement;var t=localStorage.getItem('theme');if(t==='dark')h.classList.add('dark');var l=localStorage.getItem('lang');if(!l){var n=(navigator.language||'en').toLowerCase();l=n.indexOf('pt')===0?'pt':n.indexOf('zh')===0?'zh':'en';}h.dataset["lang"]=l;if(l!=='en')h.classList.add('i18n-pending');}catch(e){}})();`;
