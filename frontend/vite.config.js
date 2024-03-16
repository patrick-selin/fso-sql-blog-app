import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// old
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // FYI: added this for cypress 
    proxy: {
      "/api": {
        target: "http://localhost:3005",
        changeOrigin: true,
      },
    },
  },
});
