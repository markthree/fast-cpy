import { defineConfig } from "vite";
import { name } from "./package.json";
import { builtinModules } from "module";
import { vitePlugin as specifierBackward } from "specifier-backward";

export default defineConfig({
  plugins: [specifierBackward()],
  build: {
    outDir: "npm",
    emptyOutDir: false,
    lib: {
      name,
      formats: ["cjs", "es"],
      entry: [
        "./src/go.ts",
        "./src/cli.ts",
        "./src/node.ts",
        "./src/index.ts",
      ],
      fileName(f, n) {
        if (f === "cjs") {
          return `${n}.cjs`;
        }
        if (f === "es") {
          return `${n}.mjs`;
        }
        return `${n}.js`;
      },
    },
    rollupOptions: {
      external: [
        "mri",
        "consola",
        "kolorist",
        ...builtinModules,
        ...builtinModules.map((v) => `node:${v}`),
      ],
    },
  },
});
