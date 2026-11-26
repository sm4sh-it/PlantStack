import assert from "node:assert/strict";
import sharp from "sharp";
import {
  MAX_IMAGE_DIMENSION,
  THUMB_IMAGE_DIMENSION,
  encodeThumbnailImage,
  sanitizeAndEncodeImage,
} from "../lib/security.ts";

const largeInput = await sharp({
  create: {
    width: 2400,
    height: 1600,
    channels: 3,
    background: { r: 30, g: 81, b: 53 },
  },
})
  .png()
  .toBuffer();

const encoded = await sanitizeAndEncodeImage(largeInput);
assert.equal(encoded.ext, "webp");
const mainMeta = await sharp(encoded.buffer).metadata();
assert.equal(mainMeta.format, "webp");
assert.ok((mainMeta.width ?? 0) <= MAX_IMAGE_DIMENSION);
assert.ok((mainMeta.height ?? 0) <= MAX_IMAGE_DIMENSION);
assert.equal(mainMeta.width, 1400);

const thumbBuf = await encodeThumbnailImage(encoded.buffer);
const thumbMeta = await sharp(thumbBuf).metadata();
assert.equal(thumbMeta.format, "webp");
assert.ok((thumbMeta.width ?? 0) <= THUMB_IMAGE_DIMENSION);
assert.equal(thumbMeta.width, 480);

console.log("image resize self-check passed");
