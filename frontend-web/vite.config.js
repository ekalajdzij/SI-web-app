import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      axios: "/node_modules/axios/dist/axios.min.js",
    },
  },
  define: {
    "process.env": process.env,
  },
});
