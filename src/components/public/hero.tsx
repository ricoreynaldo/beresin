"use client";

import { ArrowDown, ArrowUpRight, Check, Pause, Play, Sparkle, Sparkles } from "lucide-react";
import * as React from "react";
import { RequestCta } from "@/components/public/request-cta";

const REQUESTS = [
  { name: "Naya", messages: ["Kak, bikinin logo buat coffee shop-ku dong ☕", "Mau desain kemasan yang lucu, bisa?"] },
  { name: "Rafi", messages: ["Kak bisa buatin website buat usaha kecilku?", "Kak, buatin website portofolio bisa?"] },
  { name: "Dita", messages: ["Slide presentasi besok belum cantik 🥲", "Tolong rapihin layout proposal ini, ya"] },
  { name: "Adit", messages: ["Video mentahnya udah ada. Tinggal edit 🎬", "Butuh konten buat launching produk!"] },
  { name: "Lala", messages: ["Data Excel-ku boleh dirapihin? 📊", "Bantuin cari referensi riset, dong"] },
  { name: "Bima", messages: ["Aduhh tugasku mepet deadline :(", "Kak tolong cek plagiasi turnitin dong"] },
] as const;

/** Illustrated people keep the requests friendly without implying real testimonials. */
export function ChatAvatar({ index = 0, className = "" }: { index?: number; className?: string }) {
  const colors = ["#f4bea2", "#b8ccd8", "#e8b8bf", "#e9cd82", "#bfceae", "#cfc1df"];
  const hair = ["#573829", "#332821", "#583c32", "#3e302b", "#49382e", "#332821"];
  const i = index % colors.length;
  return (
    <span className={`chat-avatar ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill={colors[i]} />
        <path d="M9 64c1-15 10-22 23-22s22 7 23 22" fill={i % 2 ? "#faf1e4" : "#807c62"} />
        {i % 2 === 0 && <path d="M14 29c0-17 8-22 18-22s19 7 19 23v18H14V29Z" fill={hair[i]} />}
        <path d="M20 28c0-11 5-17 12-17s13 6 13 17v7c0 9-6 16-13 16S20 44 20 35v-7Z" fill="#f7d7b9" />
        <path d={i % 2 ? "M17 29c-3-14 4-23 17-23 12 0 17 8 14 21-8 0-14-5-17-10-1 8-8 11-14 12Z" : "M18 28C13 14 24 6 34 8c12 1 16 12 13 23-9-2-15-10-16-16-1 7-5 11-13 13Z"} fill={hair[i]} />
        <path d="M26 32v2m13-2v2" stroke="#40302b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 40c2 2 5 2 7 0" stroke="#a86e59" strokeWidth="2" strokeLinecap="round" />
        <circle cx="23" cy="38" r="3" fill="#edae9c" opacity=".6" /><circle cx="42" cy="38" r="3" fill="#edae9c" opacity=".6" />
      </svg>
    </span>
  );
}

export function Hero() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [paused, setPaused] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(section);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return (
    <section ref={sectionRef} className="chat-hero" data-paused={paused || !visible} aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="request-cloud" aria-hidden="true">
          {REQUESTS.map((request, index) => (
            <div className={`request-bubble bubble-${index + 1}`} key={request.name}>
              <div className="bubble-float">
                <ChatAvatar index={index} />
                <div className="chat-bubble">
                  <span className="bubble-name">{request.name}<span>mau dibantu</span></span>
                  <div className="bubble-messages">
                    {request.messages.map((message, messageIndex) => <p key={message} className={`bubble-message message-${messageIndex + 1}`}>{message}</p>)}
                  </div>
                  <span className="bubble-ticks"><Check size={12} /><Check size={12} /></span>
                </div>
              </div>
            </div>
          ))}
          <span className="hero-spark spark-one"><Sparkle strokeWidth={1.4} /></span>
          <span className="hero-spark spark-two"><Sparkle strokeWidth={1.4} /></span>
          <span className="tiny-chat tiny-chat-one">BISAAA DONGGG! <span>♡</span></span>
          <span className="tiny-chat tiny-chat-two"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></span>
        </div>

        <div className="hero-copy">
          <span className="hero-eyebrow"><span className="eyebrow-spark"><Sparkle strokeWidth={1.4} aria-hidden="true" /></span> Ide kamu, kita bantu jadi nyata.</span>
          <h1 id="hero-title">Butuh sesuatu?<br /><span className="hero-line">Biar kita <strong className="hero-word">BERESIN<svg viewBox="0 0 340 20" fill="none" aria-hidden="true"><path d="M5 12C87 1 241 2 335 10M30 17c101-8 197-9 267-2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></strong>.</span></h1>
          <p>Dari ide yang masih di kepala sampai to-do yang numpuk.<br className="desktop-break" /> Ceritain aja dulu. Kita cari cara beresinnya, bareng.</p>
          <RequestCta size="lg" className="hero-cta">Buat request pertamamu <span className="cta-orb"><ArrowUpRight size={19} aria-hidden="true" /></span></RequestCta>
          <div className="hero-reassurance"><span><Check size={13} /> Tanpa bikin akun</span><i /><span>Langsung ngobrol di WhatsApp</span></div>
        </div>

        <div className="hero-bottom">
          <a href="#cara-kerja" className="discover-link"><span><ArrowDown size={15} /></span> Kenalan dulu, yuk</a>
          <p>Bubble di atas adalah contoh request. Punyamu bisa beda.</p>
          <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused((value) => !value)} aria-label={paused ? "Putar animasi bubble" : "Jeda animasi bubble"}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? "Putar animasi" : "Jeda animasi"}</span></button>
        </div>
      </div>
      <div className="hero-ribbon"><Sparkles size={17} aria-hidden="true" /><p>Satu tempat untuk banyak <span>“bisa bantuin ini?”</span></p><span className="ribbon-flower" aria-hidden="true"><Sparkle strokeWidth={1.4} /></span><span className="ribbon-side">Kecil atau besar, cerita dulu aja.</span></div>
    </section>
  );
}
