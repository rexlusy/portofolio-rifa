import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist-vercel");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "public"), output, { recursive: true });

const html = await readFile(resolve(root, "index.html"), "utf8");
await writeFile(resolve(output, "index.html"), html.replaceAll("public/", ""));

console.log("Static portfolio ready for Vercel in dist-vercel/");
