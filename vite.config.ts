/// <reference types="vitest/config"/>

import preact from "@preact/preset-vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [preact(), dts()],
  build: {
    lib: {
      entry: new URL("./src/index.ts", import.meta.url).pathname,
      name: "TypeBoxForm",
    },
    rollupOptions: {
      external: ["preact"],
      output: {
        globals: {
          preact: "preact",
        },
      },
    },
  },
  test: {
    environment: "happy-dom",
  },
});
