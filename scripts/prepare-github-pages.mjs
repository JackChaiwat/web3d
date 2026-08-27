import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL("../out/", import.meta.url));
const textExtensions = new Set([".html", ".css", ".js", ".json", ".txt", ".xml"]);
const publicPathPattern = /(?<!\/web3d)\/(fonts|images|models)(?=\/)/g;
const rootFilePattern = /(?<!\/web3d)\/(og\.png|favicon\.svg)(?=["')?\s])/g;

async function rewriteDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteDirectory(path);
      continue;
    }

    const extension = entry.name.slice(entry.name.lastIndexOf("."));
    if (!textExtensions.has(extension)) continue;

    const source = await readFile(path, "utf8");
    const rewritten = source
      .replace(publicPathPattern, "/web3d/$1")
      .replace(rootFilePattern, "/web3d/$1");
    if (rewritten !== source) await writeFile(path, rewritten);
  }
}

await rewriteDirectory(outputDirectory);
await writeFile(join(outputDirectory, ".nojekyll"), "");
