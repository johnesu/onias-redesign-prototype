import type { ProfileViewEvent, ViewerDomain, VisibilityMonth } from "@/types";
import { seededRandom } from "@/lib/utils";

type ViewerCompany = {
  id: string;
  company: string;
  domain: string;
  hiringFor: string[];
  location: string;
  kind: ViewerDomain["kind"];
  weight: number;
};

const COMPANIES: ViewerCompany[] = [
  {
    id: "northwind",
    company: "Northwind Talent",
    domain: "northwindtalent.com.br",
    hiringFor: ["Engenharia Backend Staff", "Liderança de Plataforma"],
    location: "São Paulo, SP",
    kind: "consultancy",
    weight: 0.31,
  },
  {
    id: "atlas",
    company: "Atlas People",
    domain: "atlaspeople.com.br",
    hiringFor: ["Engenharia Full-Stack Sênior"],
    location: "Rio de Janeiro, RJ",
    kind: "consultancy",
    weight: 0.21,
  },
  {
    id: "lumen",
    company: "Lumen Search",
    domain: "lumensearch.io",
    hiringFor: ["Engenharia Full-Stack", "Tech Lead de Pagamentos"],
    location: "Curitiba, PR",
    kind: "consultancy",
    weight: 0.17,
  },
  {
    id: "meridian",
    company: "Meridian Tech",
    domain: "meridiantech.com.br",
    hiringFor: ["Engenharia de Software Sênior"],
    location: "São Paulo, SP",
    kind: "company",
    weight: 0.13,
  },
  {
    id: "cobalt",
    company: "Cobalt Consulting",
    domain: "cobaltconsulting.com",
    hiringFor: ["Engenharia de Plataforma"],
    location: "Remoto",
    kind: "consultancy",
    weight: 0.1,
  },
  {
    id: "aurora",
    company: "Aurora Finance",
    domain: "aurorafinance.com.br",
    hiringFor: ["Engenharia Full-Stack Sênior", "Tech Lead de Checkout"],
    location: "São Paulo, SP",
    kind: "company",
    weight: 0.08,
  },
];

const MONTH_TOTALS: Record<string, { views: number; appearances: number }> = {
  "2026-06": { views: 12, appearances: 74 },
  "2026-07": { views: 15, appearances: 81 },
  "2026-08": { views: 11, appearances: 68 },
  "2026-09": { views: 19, appearances: 103 },
  "2026-10": { views: 17, appearances: 96 },
  "2026-11": { views: 24, appearances: 132 },
};

export function getProfileVisibilityHistory(): VisibilityMonth[] {
  return Object.entries(MONTH_TOTALS).map(([month, totals]) => ({ month, ...totals }));
}

function daysInMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber, 0).getDate();
}

export function getViewersForMonth(month: string): ViewerDomain[] {
  const totals = MONTH_TOTALS[month] ?? { views: 24, appearances: 132 };
  const random = seededRandom(`viewers|${month}`);
  const lastDay = daysInMonth(month);
  const raw = COMPANIES.map((company, index) => {
    const day = Math.max(1, lastDay - index * 2 - Math.floor(random() * 2));
    return {
      ...company,
      views: Math.max(1, Math.round(totals.views * company.weight * (0.85 + random() * 0.3))),
      lastViewed: `${month}-${String(day).padStart(2, "0")}T${String(9 + index).padStart(2, "0")}:20:00`,
      hiringFor: [...company.hiringFor],
    };
  });
  const rawTotal = raw.reduce((sum, viewer) => sum + viewer.views, 0);
  const difference = totals.views - rawTotal;
  return raw
    .map((viewer, index) => (index === 0 ? { ...viewer, views: Math.max(1, viewer.views + difference) } : viewer))
    .sort((first, second) => second.views - first.views);
}

export function getProfileEvents(month: string): ProfileViewEvent[] {
  const viewers = getViewersForMonth(month);
  const lastDay = daysInMonth(month);
  const dates = [14, 12, 10, 8, 6, 3].map((offset) => `${month}-${String(Math.max(1, lastDay - offset)).padStart(2, "0")}`);
  const kinds = ["view", "match", "search", "view", "save", "match"] as const;
  return viewers.slice(0, 6).map((viewer, index) => ({
    id: `${month}-event-${index}`,
    company: viewer.company,
    domain: viewer.domain,
    date: `${dates[index]}T${String(10 + index).padStart(2, "0")}:${String(12 + index * 7).padStart(2, "0")}:00`,
    kind: kinds[index],
  }));
}

/** Months that can be selected in the visibility view, newest first. */
export const VISIBILITY_MONTHS = Object.keys(MONTH_TOTALS).sort().reverse();

const ROLE_EN: Record<string, string> = {
  "Engenharia Backend Staff": "Staff Backend Engineering",
  "Liderança de Plataforma": "Platform Leadership",
  "Engenharia Full-Stack Sênior": "Senior Full-Stack Engineering",
  "Engenharia Full-Stack": "Full-Stack Engineering",
  "Tech Lead de Pagamentos": "Payments Tech Lead",
  "Engenharia de Software Sênior": "Senior Software Engineering",
  "Engenharia de Plataforma": "Platform Engineering",
  "Tech Lead de Checkout": "Checkout Tech Lead",
};

/** Viewer hiring signals are published in Portuguese; this keeps EN mode readable. */
export function viewerRoleLabel(role: string, locale: "pt" | "en") {
  return locale === "pt" ? role : ROLE_EN[role] ?? role;
}
