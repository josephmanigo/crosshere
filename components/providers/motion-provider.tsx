"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

const ReducedMotionContext = React.createContext(false);

export function useReducedMotionContext() {
  return React.useContext(ReducedMotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
        {children}
      </MotionConfig>
    </ReducedMotionContext.Provider>
  );
}
