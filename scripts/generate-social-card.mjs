import sharp from "sharp";
import { fileURLToPath } from "node:url";

const input = fileURLToPath(new URL("../public/og/production-p-social-art.png", import.meta.url));
const output = fileURLToPath(new URL("../public/og/production-p-social.png", import.meta.url));

const overlay = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#090A0A" stop-opacity=".98"/>
      <stop offset=".43" stop-color="#090A0A" stop-opacity=".86"/>
      <stop offset=".72" stop-color="#090A0A" stop-opacity=".08"/>
      <stop offset="1" stop-color="#090A0A" stop-opacity=".02"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect x="56" y="54" width="72" height="5" rx="2.5" fill="#AF2711"/>
  <text x="56" y="104" fill="#F1EFE8" font-family="Pretendard, Apple SD Gothic Neo, sans-serif"
        font-size="18" font-weight="700" letter-spacing="3">SEOUL · AI FILM STUDIO</text>
  <text x="50" y="292" fill="#F1EFE8" font-family="Pretendard, Apple SD Gothic Neo, sans-serif"
        font-size="92" font-weight="900" letter-spacing="-6">PRODUCTION</text>
  <text x="50" y="396" fill="#AF2711" font-family="Pretendard, Apple SD Gothic Neo, sans-serif"
        font-size="122" font-weight="900" letter-spacing="-8">P.</text>
  <text x="56" y="475" fill="#F1EFE8" font-family="Pretendard, Apple SD Gothic Neo, sans-serif"
        font-size="34" font-weight="800" letter-spacing="-1">AI 영상제작 회사</text>
  <line x1="56" y1="505" x2="472" y2="505" stroke="#F1EFE8" stroke-opacity=".32"/>
  <text x="56" y="544" fill="#B8B5AE" font-family="Pretendard, Apple SD Gothic Neo, sans-serif"
        font-size="16" font-weight="600" letter-spacing=".5">AI MAKES IT POSSIBLE. WE MAKE IT CINEMA.</text>
  <text x="56" y="586" fill="#AF2711" font-family="Pretendard, Apple SD Gothic Neo, sans-serif"
        font-size="13" font-weight="800" letter-spacing="2.5">IMAGINATION, IN MOTION.</text>
</svg>`);

await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "center" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(output);

console.log(output);
