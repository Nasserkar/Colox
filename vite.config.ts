import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // To load environment variables
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react(), tailwindcss()],
    base: "./",
    server: {
      // open the browser
      open: true,
      // optional: fail if port is taken
      strictPort: true,
      port: Number(env.VITE_APP_PORT) || 3000,
    },
    preview: {
      // open the browser
      open: true,
      // optional: fail if port is taken
      strictPort: true,
      port: Number(env.VITE_APP_PORT) || 3000,
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    publicDir: "./public",
  };
});
