"use client";

import { useEffect, useState } from "react";
import { CONSENT_KEY } from "./Analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);

    if (!savedConsent) {
      setVisible(true);
    }
  }, []);

  function handleConsent(value: "accepted" | "declined") {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);

    window.dispatchEvent(new Event("pun-house-consent-change"));
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t-2 border-grape/20 bg-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="max-w-3xl">
          <p className="font-bold text-retro-dark mb-1">
            We use cookies 🍪
          </p>

          <p className="text-sm text-gray-600 leading-6">
            We use analytics cookies to understand how people use The Pun
            House and help us improve the site. You can choose whether to
            allow analytics cookies.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleConsent("declined")}
            className="px-4 py-2 rounded-full border-2 border-gray-200 text-retro-dark font-bold text-sm hover:border-grape transition-colors"
          >
            No Thanks
          </button>

          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="px-5 py-2 rounded-full bg-grape text-white font-bold text-sm hover:bg-bubblegum transition-colors"
          >
            Accept Analytics
          </button>
        </div>
      </div>
    </div>
  );
}