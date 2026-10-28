// A second file, just to show that imports are bundled into a single build/index.js.
export function greeting(name: string): string {
  return "Hello, " + (name || "stranger") + "!";
}
