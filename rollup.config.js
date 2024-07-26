// rollup.config.js
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "iife", // 可以是 'es', 'cjs', 'umd', 'iife', 等
  },
  plugins: [typescript(), terser()],
};
