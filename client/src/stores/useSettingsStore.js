import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultCurrency, currencies } from "../data/currencies";
import { defaultLanguage, languages, translations } from "../data/translations";

const settingsStore = (set, get) => ({
  currentCurrency: defaultCurrency,
  currentLanguage: defaultLanguage,

  setCurrency: (currency) => {
    const found =
      typeof currency === "string"
        ? currencies.find((c) => c.code === currency) || defaultCurrency
        : currency;
    set({ currentCurrency: found });
  },

  setLanguage: (language) => {
    const found =
      typeof language === "string"
        ? languages.find((l) => l.code === language) || defaultLanguage
        : language;
    set({ currentLanguage: found });
  },

  // Dynamic price conversion helper
  formatPrice: (amountInUSD) => {
    const { currentCurrency } = get();
    const num = parseFloat(amountInUSD);
    if (isNaN(num)) return `${currentCurrency?.symbol || "$"}${amountInUSD || 0}`;

    const converted = num * (currentCurrency?.rate || 1);
    
    // Format based on currency magnitude
    let formattedNum;
    if (currentCurrency.rate >= 10) {
      formattedNum = Math.round(converted).toLocaleString();
    } else {
      formattedNum = converted.toLocaleString(undefined, {
        minimumFractionDigits: Number.isInteger(converted) ? 0 : 2,
        maximumFractionDigits: 2,
      });
    }

    if (currentCurrency.placement === "after") {
      return `${formattedNum} ${currentCurrency.symbol}`;
    }
    return `${currentCurrency.symbol}${formattedNum}`;
  },

  // Translation helper
  t: (path) => {
    const { currentLanguage } = get();
    const langCode = currentLanguage?.code || "en";
    const dict = translations[langCode] || translations.en;

    const parts = path.split(".");
    let curr = dict;
    for (const part of parts) {
      if (curr && curr[part] !== undefined) {
        curr = curr[part];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fPart of parts) {
          if (fallback && fallback[fPart] !== undefined) {
            fallback = fallback[fPart];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return curr;
  },
});

export const useSettingsStore = create(
  persist(settingsStore, {
    name: "trust_plus_settings",
  })
);

export default useSettingsStore;
