import { existsSync, renameSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const projectRoot = process.cwd();
const videoDirectory = join(projectRoot, "public", "videos");
const videoStash = join(projectRoot, ".pages-video-stash");
const nextExportDirectory = join(projectRoot, ".next-pages");
const pagesOutputDirectory = join(projectRoot, "out");

if (!existsSync(videoDirectory)) {
  throw new Error("public/videos directory was not found.");
}
if (existsSync(videoStash)) {
  throw new Error(
    ".pages-video-stash already exists. Restore it to public/videos before building.",
  );
}

// Cloudflare Pages does not provide ffprobe. The generated catalog is committed,
// so remote builds can safely reuse it while local builds continue to refresh it.
if (process.env.CF_PAGES !== "1") {
  const catalog = spawnSync(
    process.execPath,
    [join(projectRoot, "scripts", "build-video-catalog.mjs")],
    { cwd: projectRoot, stdio: "inherit" },
  );
  if (catalog.status !== 0) process.exit(catalog.status ?? 1);
} else {
  console.log("Cloudflare Pages detected; using the committed video catalog.");
}

renameSync(videoDirectory, videoStash);

try {
  rmSync(pagesOutputDirectory, { recursive: true, force: true });
  const build = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["next", "build"],
    {
      cwd: projectRoot,
      stdio: "inherit",
      env: { ...process.env, CLOUDFLARE_DEPLOY: "1" },
    },
  );
  if (build.status !== 0) {
    process.exitCode = build.status ?? 1;
  } else if (
    !existsSync(pagesOutputDirectory) &&
    existsSync(join(nextExportDirectory, "index.html"))
  ) {
    // With a custom Next.js distDir, Next 15 writes the static export into
    // that directory instead of the historical `out` directory. Cloudflare
    // Pages is configured to publish `out`, so normalize the result here.
    renameSync(nextExportDirectory, pagesOutputDirectory);
    console.log("Cloudflare Pages output prepared in out/.");
  } else if (!existsSync(pagesOutputDirectory)) {
    throw new Error("Next.js completed without producing a static export.");
  }
} finally {
  renameSync(videoStash, videoDirectory);
}
