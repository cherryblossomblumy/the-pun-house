"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const CONSENT_KEY = "pun-house-analytics-consent";

export function Analytics() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const updateConsent = () => {
      setConsent(localStorage.getItem(CONSENT_KEY));
    };

    updateConsent();

    window.addEventListener(
      "pun-house-consent-change",
      updateConsent
    );

    return () => {
      window.removeEventListener(
        "pun-house-consent-change",
        updateConsent
      );
    };
  }, []);

  if (consent !== "accepted") {
    return null;
  }

  return <GoogleAnalytics gaId="G-L3D7NTJ6SJ" />;
}

export { CONSENT_KEY };