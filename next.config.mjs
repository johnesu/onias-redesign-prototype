import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  eslint: {
    // The prototype is validated with `npm run lint` separately.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      { source: "/jobs", destination: "/vagas", permanent: false },
      { source: "/jobs/:id", destination: "/vagas/:id", permanent: false },
      { source: "/market", destination: "/estatisticas/oferta-demanda", permanent: false },
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/statistics", destination: "/estatisticas/telegram", permanent: false },
      { source: "/statistics/supply-demand", destination: "/estatisticas/oferta-demanda", permanent: false },
      { source: "/recruitment/viewed", destination: "/quem-me-viu", permanent: false },
      { source: "/recruitment/candidates/:id", destination: "/vagas", permanent: false },
      { source: "/recruitment", destination: "/vagas", permanent: false },
      { source: "/support", destination: "/", permanent: false },
      { source: "/settings", destination: "/perfil/editar", permanent: false },
      { source: "/insights", destination: "/estatisticas/curiosidades", permanent: false },
      { source: "/resume", destination: "/curriculo", permanent: false },
      { source: "/activity", destination: "/quem-me-viu", permanent: false },
      { source: "/profile/edit", destination: "/perfil/editar", permanent: false },
      { source: "/profile", destination: "/perfil", permanent: false },
    ];
  },
};

export default nextConfig;
