import { useMemo, useRef } from "react";
import { usePreferences } from "@/context/preferences-context";
import translations from "@/data/translations";

export const useTranslate = () => {
  const { language } = usePreferences();
  const missingKeysRef = useRef<Set<string>>(new Set());

  const t = useMemo(() => {
    return (key: string, fallback?: string) => {
      const entry = translations[key];
      if (entry) {
        // Try requested language first, then English, then any available value.
        return (
          entry[language] ??
          entry.en ??
          Object.values(entry).find(Boolean) ??
          fallback ??
          key
        );
      }

      if (!missingKeysRef.current.has(key)) {
        // Log once to help catch untranslated strings while keeping UI stable.
        console.warn(`[i18n] Missing translation key: ${key}`);
        missingKeysRef.current.add(key);
      }
      return fallback ?? key;
    };
  }, [language]);

  return { t, lang: language };
};

export type TranslateFn = (key: string, fallback?: string) => string;
