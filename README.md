# nakama-typescript-bundle-template

A minimal template for writing [Nakama](https://heroiclabs.com/nakama/) server runtime code in **TypeScript split across several files**, bundled into a single `build/index.js` with [esbuild](https://esbuild.github.io/).
Meant as an example for [heroiclabs/nakama#571](https://github.com/heroiclabs/nakama/issues/571) (bundling the TypeScript runtime).

## The one gotcha

The Nakama JavaScript runtime does not accept ES modules or an IIFE wrapper: `InitModule` (and match handlers such as `matchInit`, `matchLoop`...) must be **plain functions in the global scope** of the file.

esbuild can bundle fine, but its ESM output ends with `export { InitModule };`. `scripts/build.mjs` bundles as ESM and then removes that `export { ... }` statement, which leaves the functions global. It also fails the build if an `import`/`export` is left or if `InitModule` is missing, so mistakes show up at build time instead of at server startup.

## Layout

```
src/main.ts        InitModule + a "hello" RPC
src/greeting.ts    second file, to show that imports get bundled
scripts/build.mjs  esbuild bundle + the export fix
docker-compose.yml Postgres + Nakama 3.26.0 mounting ./build as the modules folder
```

## Use it

```bash
npm install
npm run typecheck   # tsc with the nakama-runtime type definitions
npm run build       # writes build/index.js
docker compose up   # Nakama on http://127.0.0.1:7350
```

Call the RPC (default dev http key):

```bash
curl -X POST "http://127.0.0.1:7350/v2/rpc/hello?http_key=defaulthttpkey" \
  -H "Content-Type: application/json" -d '"{\"name\":\"Francisco\"}"'
# {"payload":"{\"message\":\"Hello, Francisco!\"}"}
```

## Notes

- Tested with Nakama 3.26.0. The bundle above loads and the RPC answers.
- Match handlers: export them from `src/main.ts` the same way (`export function matchInit...`) and register them inside `InitModule` with `initializer.registerMatch(...)`; they stay global after the build.
- Dev credentials in `docker-compose.yml` are for local use only.

## License

MIT, see [LICENSE](LICENSE).
