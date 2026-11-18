import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const OUTPUT_DIR = path.resolve("screenshots");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const executablePath = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));

if (!executablePath) {
  console.error("No Chrome or Edge executable found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const ROUTES = [
  { slug: "home", path: "/" },
  { slug: "jobs", path: "/vagas" },
  { slug: "job-detail", path: "/vagas/fullstack-senior-aurora" },
  { slug: "telegram", path: "/estatisticas/telegram" },
  { slug: "supply-demand", path: "/estatisticas/oferta-demanda" },
  { slug: "curiosities", path: "/estatisticas/curiosidades" },
  { slug: "profile", path: "/perfil" },
  { slug: "profile-create", path: "/perfil/criar" },
  { slug: "profile-edit", path: "/perfil/editar" },
  { slug: "resume", path: "/curriculo" },
  { slug: "who-viewed", path: "/quem-me-viu" },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 1000 },
  laptop: { width: 1024, height: 900 },
  tablet: { width: 768, height: 1000 },
  mobile: { width: 390, height: 844 },
  compact: { width: 360, height: 800 },
};

/** The desktop light set is the reference gallery; the rest proves responsive behaviour. */
const MATRIX = [
  ...ROUTES.map((route) => ({ ...route, viewport: "desktop", theme: "light" })),
  ...["home", "jobs", "job-detail", "telegram", "supply-demand", "profile", "who-viewed"].map((slug) => ({
    ...ROUTES.find((route) => route.slug === slug),
    viewport: "desktop",
    theme: "dark",
  })),
  ...["home", "jobs", "telegram", "supply-demand", "profile"].map((slug) => ({
    ...ROUTES.find((route) => route.slug === slug),
    viewport: "laptop",
    theme: "light",
  })),
  ...["home", "jobs", "job-detail", "profile", "resume"].map((slug) => ({
    ...ROUTES.find((route) => route.slug === slug),
    viewport: "tablet",
    theme: "light",
  })),
  ...["home", "jobs", "job-detail", "telegram", "profile", "who-viewed", "resume", "profile-create"].map((slug) => ({
    ...ROUTES.find((route) => route.slug === slug),
    viewport: "mobile",
    theme: "light",
  })),
  ...["home", "jobs", "profile"].map((slug) => ({
    ...ROUTES.find((route) => route.slug === slug),
    viewport: "compact",
    theme: "light",
  })),
  ...["home", "jobs", "job-detail", "profile", "who-viewed", "profile-create"].map((slug) => ({
    ...ROUTES.find((route) => route.slug === slug),
    slug: `${slug}-en`,
    viewport: "desktop",
    theme: "light",
    locale: "en",
  })),
  {
    slug: "who-viewed-unlocked",
    path: "/quem-me-viu",
    viewport: "desktop",
    theme: "light",
    unlock: true,
  },
  {
    slug: "jobs-filters",
    path: "/vagas",
    viewport: "mobile",
    theme: "light",
    filters: true,
    fullPage: false,
  },
  {
    slug: "resume-print",
    path: "/curriculo",
    viewport: "desktop",
    theme: "light",
    media: "print",
  },
];

await mkdir(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
let failures = 0;

for (const target of MATRIX) {
  const viewport = VIEWPORTS[target.viewport];
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: target.theme,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  if (target.media) {
    await page.emulateMedia({ media: target.media });
  }

  if (target.locale) {
    await context.addCookies([
      { name: "onias.demo.v1.locale", value: target.locale, url: BASE_URL, sameSite: "Lax" },
    ]);
  }

  await page.addInitScript((theme) => {
    window.localStorage.setItem("onias.demo.v1.theme", theme);
  }, target.theme);

  page.on("pageerror", (error) => {
    failures += 1;
    console.error(`  page error on ${target.path}: ${error.message}`);
  });

  try {
    const response = await page.goto(`${BASE_URL}${target.path}`, { waitUntil: "networkidle", timeout: 45_000 });
    if (!response || response.status() >= 400) {
      throw new Error(`HTTP ${response?.status() ?? "unknown"}`);
    }
    await page.addStyleTag({
      content: "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }",
    });
    if (target.fullPage !== false) {
      await page.addStyleTag({
        content:
          "[data-mobile-nav] { display: none !important; } header.sticky { position: static !important; top: auto !important; }",
      });
    }
    await page.addStyleTag({
      content: "[data-sonner-toaster] { display: none !important; }",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    if (target.unlock) {
      await page.getByRole("button", { name: /Revelar domínios|Reveal domains/ }).click();
      await page.waitForTimeout(1400);
    }

    if (target.filters) {
      await page.getByRole("button", { name: /^Filtros|^Filters/ }).click();
      await page.waitForTimeout(450);
    }

    const filename = `${target.viewport}-${target.slug}-${target.theme}.png`;
    const file = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: file, fullPage: target.fullPage !== false });
    const { size } = await stat(file);
    console.log(`✓ ${filename} (${Math.round(size / 1024)} KB)`);
  } catch (error) {
    failures += 1;
    console.error(`✗ ${target.viewport}-${target.slug}-${target.theme}: ${error instanceof Error ? error.message : error}`);
  } finally {
    await context.close();
  }
}

await browser.close();

if (failures > 0) {
  console.error(`\n${failures} screenshot target(s) failed.`);
  process.exit(1);
}

console.log(`\nSaved ${MATRIX.length} screenshots to ${path.relative(process.cwd(), OUTPUT_DIR)}.`);
