import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
await fs.mkdir(publicDir, { recursive: true });

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#090B0F"/>
  <path d="M0 480H1200" stroke="#25313B" stroke-width="2"/>
  <path d="M110 100H1090V530H110V100Z" fill="#10151C" stroke="#2C3742" stroke-width="2"/>
  <path d="M170 170H1030" stroke="#29333D" stroke-width="2"/>
  <path d="M170 230H820" stroke="#29333D" stroke-width="2"/>
  <path d="M170 290H970" stroke="#29333D" stroke-width="2"/>
  <path d="M170 350H720" stroke="#29333D" stroke-width="2"/>
  <circle cx="985" cy="205" r="72" fill="#3EE0C2" fill-opacity="0.18" stroke="#3EE0C2" stroke-width="3"/>
  <circle cx="985" cy="205" r="33" fill="#3EE0C2" fill-opacity="0.24"/>
  <rect x="170" y="420" width="180" height="42" rx="8" fill="#3EE0C2"/>
  <rect x="370" y="420" width="170" height="42" rx="8" fill="#F5B84B"/>
  <rect x="560" y="420" width="210" height="42" rx="8" fill="#FF6F91"/>
  <text x="170" y="158" fill="#3EE0C2" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">Rami Del Toro</text>
  <text x="170" y="285" fill="#F4F1E8" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="800">Senior Software</text>
  <text x="170" y="365" fill="#F4F1E8" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="800">Engineer</text>
  <text x="170" y="490" fill="#B8B0A3" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="600">Cloud systems · APIs · Resilience · Algorithms</text>
</svg>`;

await fs.writeFile(path.join(publicDir, "og.svg"), svg);
await sharp(Buffer.from(svg)).png().toFile(path.join(publicDir, "og.png"));
