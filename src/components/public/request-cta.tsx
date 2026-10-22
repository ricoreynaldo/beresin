"use client";

import * as React from "react";
import { ButtonLink } from "@/components/ui/button";

/** A real link keeps keyboard navigation and modifier clicks native. */
export function RequestCta(props: Omit<React.ComponentProps<typeof ButtonLink>, "href">) {
  return <ButtonLink href="/request" {...props} />;
}
