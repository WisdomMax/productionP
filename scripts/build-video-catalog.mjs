import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative, sep } from "node:path";

const projectRoot = process.cwd();
const videoRoot = join(projectRoot, "public", "videos");
const posterRoot = join(projectRoot, "public", "posters", "auto");
const outputPath = join(projectRoot, "data", "video-catalog.json");
const titleOverrides = JSON.parse(
  readFileSync(join(projectRoot, "data", "video-title-overrides.json"), "utf8"),
);
const industryOverrides = JSON.parse(
  readFileSync(join(projectRoot, "data", "video-industry-overrides.json"), "utf8"),
);
const categoryOverrides = JSON.parse(
  readFileSync(join(projectRoot, "data", "video-category-overrides.json"), "utf8"),
);

const categories = {
  "01-commercial": { order: 1, slug: "commercial", label: "광고" },
  "02-brand-film": { order: 2, slug: "brand-film", label: "브랜드 필름" },
  "03-product": { order: 1, slug: "commercial", label: "광고" },
  "04-film-content": { order: 4, slug: "film-content", label: "필름 · 콘텐츠" },
  "05-p-lab": { order: 5, slug: "p-lab", label: "P LAB" },
  "06-animation": { order: 6, slug: "animation", label: "애니메이션" },
  "07-awards": { order: 7, slug: "awards", label: "교육생 공모전" },
};
const categoriesBySlug = new Map(
  Object.values(categories).map((category) => [category.slug, category]),
);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function publicUrl(relativePath) {
  return `/${relativePath
    .split(sep)
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

function probe(filePath) {
  const result = execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,sample_aspect_ratio,display_aspect_ratio:format=duration",
      "-of",
      "json",
      filePath,
    ],
    { encoding: "utf8" },
  );
  const parsed = JSON.parse(result);
  const stream = parsed.streams[0];
  const parseRatio = (value) => {
    if (!value || value === "N/A") return null;
    const [left, right] = value.split(":").map(Number);
    return left > 0 && right > 0 ? left / right : null;
  };
  const sampleRatio = parseRatio(stream.sample_aspect_ratio) ?? 1;
  const displayRatio =
    parseRatio(stream.display_aspect_ratio) ??
    (Number(stream.width) * sampleRatio) / Number(stream.height);
  return {
    width: Number(stream.width),
    height: Number(stream.height),
    sampleRatio,
    displayRatio,
    duration: Number(parsed.format.duration),
  };
}

function createPoster(filePath, posterPath, duration, displayRatio) {
  if (existsSync(posterPath)) {
    const currentPoster = probe(posterPath);
    const currentRatio = currentPoster.width / currentPoster.height;
    if (Math.abs(currentRatio - displayRatio) < 0.04) return;
  }
  const seek = Math.min(Math.max(duration * 0.2, 1), Math.max(duration - 0.5, 1));
  execFileSync(
    "ffmpeg",
    [
      "-loglevel",
      "error",
      "-y",
      "-ss",
      seek.toFixed(3),
      "-i",
      filePath,
      "-frames:v",
      "1",
      "-vf",
      "scale='trunc(iw*sar/2)*2':ih,setsar=1,scale='min(1280,iw)':-2",
      "-q:v",
      "4",
      posterPath,
    ],
    { stdio: "inherit" },
  );
}

mkdirSync(posterRoot, { recursive: true });

const discovered = walk(videoRoot)
  .filter((filePath) => extname(filePath).toLowerCase() === ".mp4")
  .map((filePath) => {
    const relativeVideo = relative(join(projectRoot, "public"), filePath);
    const parts = relative(videoRoot, filePath).split(sep);
    const category = categories[parts[0]];
    if (!category) return null;
    const fileName = parts.at(-1);
    const id = createHash("sha1").update(relativeVideo).digest("hex").slice(0, 12);
    const assignedCategorySlugs =
      categoryOverrides[fileName] ?? categoryOverrides[id] ?? [category.slug];
    const assignedCategories = assignedCategorySlugs.map((slug) => {
      const assignedCategory = categoriesBySlug.get(slug);
      if (!assignedCategory) {
        throw new Error(`Unknown category "${slug}" assigned to ${fileName}`);
      }
      return assignedCategory;
    });

    const status =
      parts[0] === "07-awards"
        ? parts[1] === "winners"
          ? "수상작"
          : "출품작"
        : null;
    const metadata = probe(filePath);
    const ratio = metadata.displayRatio;
    const orientation = ratio <= 1.08 ? "portrait" : "landscape";
    const posterRelative = join("posters", "auto", `${id}.jpg`);
    createPoster(
      filePath,
      join(projectRoot, "public", posterRelative),
      metadata.duration,
      metadata.displayRatio,
    );

    return {
      id,
      fileName,
      src: publicUrl(join("videos", ...parts)),
      poster: publicUrl(posterRelative),
      category: category.slug,
      categoryLabel: category.label,
      categoryOrder: category.order,
      categories: assignedCategories.map((assignedCategory) => assignedCategory.slug),
      categoryLabels: assignedCategories.map((assignedCategory) => assignedCategory.label),
      status,
      orientation,
      width: metadata.width,
      height: metadata.height,
      duration: Math.round(metadata.duration),
    };
  })
  .filter(Boolean)
  .sort(
    (a, b) =>
      a.categoryOrder - b.categoryOrder ||
      a.fileName.localeCompare(b.fileName, "ko"),
  );

const awardCounters = { 출품작: 0, 수상작: 0 };
const catalog = discovered.map((item) => {
  let title = item.fileName.replace(/\.mp4$/i, "").replaceAll("_", " ").trim();
  if (item.category === "awards" && item.status) {
    awardCounters[item.status] += 1;
    title = `P LAB 교육생 ${item.status} ${String(awardCounters[item.status]).padStart(2, "0")}`;
  }
  title = titleOverrides[item.fileName] ?? titleOverrides[item.id] ?? title;
  const industries =
    industryOverrides[item.fileName] ?? industryOverrides[item.id] ?? [];
  return { ...item, title, industries };
});

writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Video catalog: ${catalog.length} works`);
