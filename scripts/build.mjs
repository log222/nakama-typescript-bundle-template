// Bundles src/main.ts into build/index.js for the Nakama JavaScript runtime.
//
// The runtime does not accept ES modules or an IIFE wrapper: InitModule (and any match
// handlers) must be plain functions in the global scope of the file. So we bundle as ESM
// and then strip the trailing `export { ... }` statement, which leaves the functions global.
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";

const result = await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "esm",
  target: "es2015",
  write: false,
});

let code = result.outputFiles[0].text;
code = code.replace(/^export\s*\{[\s\S]*?\};?\s*$/gm, "");
if (/^\s*(export|import)\s/m.test(code)) throw new Error("The bundle still contains import/export");
if (!/function InitModule\s*\(/.test(code)) throw new Error("InitModule was not found as a global function");

mkdirSync("build", { recursive: true });
writeFileSync("build/index.js", code);
console.log("build/index.js written (" + code.length + " bytes)");
