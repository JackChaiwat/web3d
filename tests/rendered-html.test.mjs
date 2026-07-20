import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Hangermann landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="th">/i);
  assert.match(html, /<title>Hangermann Finishing Systems[^<]*<\/title>/i);
  assert.match(html, /HANGERMANN/);
  assert.match(html, /ผู้เชี่ยวชาญด้านการลอกสีอุตสาหกรรม/);
  assert.match(html, /ISO 9001:2015/);
  assert.match(html, /href="tel:027065066"/);
  assert.match(html, /id="main-content"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the finished product metadata and core sections in source", async () => {
  const [css, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const section of ["top", "about", "services", "quality", "process", "contact"]) {
    assert.match(page, new RegExp(`id=["']${section}["']`));
  }
  assert.match(page, /<WheelScene(?:\s[^>]*)?\s*\/>/);
  assert.match(page, /className="skip-link"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /title:\s*"Hangermann Finishing Systems/);
  assert.match(packageJson, /"name":\s*"hangermann-finishing-systems"/);
  assert.doesNotMatch(page + layout + packageJson, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});
