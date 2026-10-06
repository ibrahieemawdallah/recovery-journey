/**
 * Generates the app's icon set from the real brand artwork.
 *
 * Source of truth: public/logo-poster.png — the 1080x1080 render of the tree
 * mark, which matches public/logo-anim.mp4 and the TreeLogoMark component.
 *
 * Run:  node scripts/gen-icons.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/logo-poster.png";

/** Corner pixel of the source, used to pad the maskable variant. */
async function cornerColor(src) {
  const { data } = await sharp(src)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [r, g, b] = data;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

async function main() {
  await mkdir("public/icons", { recursive: true });
  const bg = await cornerColor(SRC);
  console.log("  source background:", bg);

  // Standard PWA icons — the mark fills the frame.
  for (const size of [192, 512]) {
    await sharp(SRC)
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toFile(`public/icons/icon-${size}.png`);
    console.log(`  wrote public/icons/icon-${size}.png`);
  }

  // Maskable: artwork inset to ~72% so Android's circular crop never clips it.
  const inner = Math.round(512 * 0.72);
  const inset = await sharp(SRC)
    .resize(inner, inner, { fit: "cover" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: bg },
  })
    .composite([{ input: inset, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile("public/icons/icon-maskable-512.png");
  console.log("  wrote public/icons/icon-maskable-512.png");

  // Next.js app-router conventions: auto-wired as favicon and iOS home icon.
  await sharp(SRC)
    .resize(512, 512, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile("src/app/icon.png");
  console.log("  wrote src/app/icon.png (favicon)");

  await sharp(SRC)
    .resize(180, 180, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile("src/app/apple-icon.png");
  console.log("  wrote src/app/apple-icon.png");

  console.log("done");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
