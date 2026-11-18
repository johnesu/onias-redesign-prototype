import type { Locale } from "@/lib/locale";

const LOCALE_TAG: Record<Locale, string> = { pt: "pt-BR", en: "en-US" };

const numberFormatters = {
  pt: new Intl.NumberFormat("pt-BR"),
  en: new Intl.NumberFormat("en-US"),
};

const compactFormatters = {
  pt: new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }),
  en: new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }),
};

const currencyFormatters = {
  pt: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }),
};

const compactCurrencyFormatters = {
  pt: new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }),
  en: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }),
};

export function formatNumber(value: number, locale: Locale = "pt") {
  return numberFormatters[locale].format(Math.round(value));
}

export function formatCompact(value: number, locale: Locale = "pt") {
  return compactFormatters[locale].format(value);
}

export function formatCurrency(value: number, locale: Locale = "pt") {
  return currencyFormatters[locale].format(value);
}

export function formatCompactCurrency(value: number, locale: Locale = "pt") {
  return compactCurrencyFormatters[locale].format(value);
}

export function formatPercent(value: number, digits = 1, locale: Locale = "pt") {
  const formatted = new Intl.NumberFormat(LOCALE_TAG[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(value));
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatted}%`;
}

export function formatDate(iso: string, locale: Locale = "pt") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function formatDateShort(iso: string, locale: Locale = "pt") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], { day: "2-digit", month: "short" }).format(date);
}

export function formatDateTime(iso: string, locale: Locale = "pt") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function relativeTime(iso: string, locale: Locale = "pt", now = new Date("2026-11-15T09:30:00")) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diff = now.getTime() - date.getTime();
  const minutes = Math.max(0, Math.round(diff / 60000));
  const isPt = locale === "pt";
  if (minutes < 1) return isPt ? "agora" : "just now";
  if (minutes < 60) return isPt ? `há ${minutes} min` : `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return isPt ? `há ${hours} h` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return isPt ? `há ${days} d` : `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return isPt ? `há ${weeks} sem` : `${weeks}w ago`;
  return formatDate(iso, locale);
}

export function pluralize(count: number, singular: string, plural: string, locale: Locale = "pt") {
  return `${formatNumber(count, locale)} ${count === 1 ? singular : plural}`;
}
