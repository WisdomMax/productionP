import { readdirSync, renameSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const root = process.cwd();
const videoRoot = join(root, "public", "videos");

const curatedNames = new Map(
  Object.entries({
    노스페이스광고: "extreme-terrain",
    "노을장 소스광고": "taste-the-sunset",
    "메가커피 광고": "mega-moment",
    "아파트 구조를 보여주는 AI": "space-reimagined",
    "옷이 변하는 효과": "second-skin",
    청춘버거: "bite-into-youth",
    "핫식스 광고": "unlock-the-night",
    "향수 광고": "trace-of-you",
    향수광고: "scent-in-motion",
    "좀비 빠따": "after-hours-wonderland",
    "3D그래픽 디자인": "beyond-the-frame",
    "사람이 변하고 공간이 변한다": "shifting-realities",
    "세트장 촬영은 이제 필요 없다": "no-set-required",
    "액체와 자동차 표면": "fluid-machine",
    "용암 분출": "molten-earth",
    "음식만드는 장면": "synthetic-taste",
    "음식에 이름 표시해주는": "edible-typography",
    "컵이 변하는 영상": "form-function",
    애니메이션: "iron-pulse",
    "홈페이지 히어로_압축": "hero-source-original",
  }).map(([key, value]) => [key.normalize("NFC"), value]),
);

function mp4Files(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extname(entry.name).toLowerCase() === ".mp4")
    .map((entry) => join(directory, entry.name));
}

function renameFile(source, nextBaseName) {
  const target = join(dirname(source), `${nextBaseName}.mp4`);
  if (source === target) return;
  renameSync(source, target);
  console.log(`${basename(source)} -> ${basename(target)}`);
}

for (const folder of [
  "01-commercial",
  "02-brand-film",
  "05-p-lab",
  "06-animation",
]) {
  for (const file of mp4Files(join(videoRoot, folder))) {
    const original = basename(file, extname(file)).trim().normalize("NFC");
    const nextName = curatedNames.get(original);
    if (!nextName) throw new Error(`Missing curated filename for: ${file}`);
    renameFile(file, nextName);
  }
}

const heroSource = mp4Files(join(videoRoot, "00-hero-depth", "source"));
for (const file of heroSource) {
  const original = basename(file, extname(file)).trim().normalize("NFC");
  const nextName = curatedNames.get(original);
  if (!nextName) throw new Error(`Missing hero filename for: ${file}`);
  renameFile(file, nextName);
}

for (const [folder, prefix] of [
  ["submissions", "plab-submission"],
  ["winners", "plab-winner"],
]) {
  const files = mp4Files(join(videoRoot, "07-awards", folder)).sort((a, b) =>
    basename(a).localeCompare(basename(b), "ko"),
  );
  files.forEach((file, index) => {
    renameFile(file, `${prefix}-${String(index + 1).padStart(2, "0")}`);
  });
}
