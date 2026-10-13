"use client";

import * as React from "react";
import { ButtonLink } from "@/components/ui/button";

/** Event yang diklaim hero kalau animasi tangan bisa diputar sebelum pindah halaman. */
export const REACH_EVENT = "beresin:reach";

/**
 * Link "Buat Request". Di landing, hero menangkap event REACH_EVENT,
 * memutar animasi kedua tangan bersentuhan, lalu baru berpindah ke /request.
 * Di halaman lain (atau saat hero tidak terlihat) tidak ada yang mengklaim
 * event-nya, jadi link berjalan normal.
 */
export function RequestCta(props: Omit<React.ComponentProps<typeof ButtonLink>, "href">) {
  const { onClick, ...rest } = props;

  return (
    <ButtonLink
      href="/request"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        const claimed = !window.dispatchEvent(new CustomEvent(REACH_EVENT, { cancelable: true }));
        if (claimed) event.preventDefault();
      }}
      {...rest}
    />
  );
}
