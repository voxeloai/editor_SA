import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";
import autoprefixer from "autoprefixer";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_TYPE = process.env.BUILD_TYPE || "release";
const ENGINE_DIR = path.resolve(
  __dirname,
  `node_modules/playcanvas/build/playcanvas${
    BUILD_TYPE === "debug" ? ".dbg" : ""
  }/src/index.js`
);
const PCUI_DIR = path.resolve(__dirname, "node_modules/@playcanvas/pcui");

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      playcanvas: ENGINE_DIR,
      "@playcanvas/pcui": PCUI_DIR,
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "src/manifest.json", dest: "." },
        { src: "node_modules/jszip/dist/jszip.js", dest: "." },
        { src: "static/images", dest: "static" },
        { src: "static/icons", dest: "static" },
        { src: "static/lib", dest: "static" },
        { src: "static/locales", dest: "static" },
        { src: "static/env/VertebraeHDRI_v1_512.png", dest: "static/env" },
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
    preprocessorOptions: {
      scss: {
        includePaths: [`${PCUI_DIR}/dist`],
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
