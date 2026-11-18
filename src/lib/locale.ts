export type Locale = "pt" | "en";

export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALE_COOKIE = "onias.demo.v1.locale";

export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "pt";
}

export function pick<T>(locale: Locale, pt: T, en: T): T {
  return locale === "pt" ? pt : en;
}
