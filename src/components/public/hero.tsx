"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { AsciiHands, type AsciiHandsHandle } from "@/components/public/ascii-hands";
import { REACH_EVENT, RequestCta } from "@/components/public/request-cta";
import { cn } from "@/lib/utils";

/** Garis titik-titik tipis di latar, posisinya mengikuti referensi desain. */
const DOTTED_ROWS = [
  { top: "4%", left: "52%", width: "5%" },
  { top: "4%", left: "68%", width: "5%" },
  { top: "4%", left: "81%", width: "6%" },
  { top: "4%", left: "92%", width: "5%" },
  { top: "12%", left: "0%", width: "4%" },
  { top: "12%", left: "9%", width: "5%" },
  { top: "12%", left: "19%", width: "6%" },
  { top: "12%", left: "30%", width: "4%" },
  { top: "12%", left: "40%", width: "6%" },
];

export function Hero() {
  const router = useRouter();
  const sectionRef = React.useRef<HTMLElement>(null);
  const handsRef = React.useRef<AsciiHandsHandle>(null);
  const [reaching, setReaching] = React.useState(false);
  const reachingRef = React.useRef(false);

  React.useEffect(() => {
    router.prefetch("/request");

    function onReach(event: Event) {
      if (reachingRef.current) {
        event.preventDefault();
        return;
      }
      const section = sectionRef.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Animasi hanya diputar kalau hero masih cukup terlihat di layar.
      if (!section || reduced || section.getBoundingClientRect().bottom < window.innerHeight * 0.5) {
        return;
      }

      event.preventDefault();
      reachingRef.current = true;
      setReaching(true);
      handsRef.current
        ?.reach()
        .then(() => router.push("/request"))
        .catch(() => router.push("/request"));
    }

    window.addEventListener(REACH_EVENT, onReach);
    return () => window.removeEventListener(REACH_EVENT, onReach);
  }, [router]);

  const fade = cn(
    "transition-[opacity,filter,transform] duration-500 ease-out",
    reaching && "pointer-events-none translate-y-1 opacity-0 blur-[2px]"
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden sm:min-h-[calc(100dvh-6rem)]"
    >
      <AsciiHands ref={handsRef} className="absolute inset-0 -z-10" />

      <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", fade)}>
        {DOTTED_ROWS.map((row, index) => (
          <span
            key={index}
            className="absolute hidden border-t border-dotted border-ink-300 sm:block"
            style={row}
          />
        ))}
      </div>

      <div className={cn("container-page mt-[clamp(3.5rem,15vh,9rem)] text-center", fade)}>
        <h1 className="animate-rise text-[clamp(2.1rem,4.6vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.03em]">
          <span className="text-ink-400">Butuh sesuatu?</span>
          <br />
          <span className="text-ink-900">
            Biar kita <strong className="font-bold">BERESIN</strong>.
          </span>
        </h1>
        <p className="animate-rise mx-auto mt-3 max-w-xs text-[13px] leading-snug text-ink-500 [animation-delay:80ms]">
          Ceritakan apa yang kamu butuhkan. Isi satu form singkat, request langsung terkirim ke
          WhatsApp kami.
        </p>
        <div className="animate-rise mt-6 [animation-delay:160ms]">
          <RequestCta size="md">Buat Request</RequestCta>
        </div>
      </div>

      <div
        className={cn(
          "container-page mt-auto grid gap-4 pb-6 pt-10 text-[13px] leading-snug text-ink-600 sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:pb-8 sm:text-sm",
          fade
        )}
      >
        <p className="hidden sm:block">Tanpa akun. Tanpa ribet.</p>
        <p className="text-center">
          Ceritakan kebutuhanmu, kirim lewat WhatsApp.
          <br />
          Ngobrol, deal, dan beres di chat yang sama.
        </p>
        <a
          href="#cara-kerja"
          className="hidden justify-self-end transition-colors hover:text-ink-900 sm:block"
        >
          [Scroll untuk lanjut]
        </a>
      </div>
    </section>
  );
}
