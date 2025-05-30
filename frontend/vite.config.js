import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5050",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser", // Add this line
    },
  },
  define: {
    "process.env": {}, // Add this to avoid process.env errors
  },
});
