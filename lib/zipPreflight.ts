export interface ZipPreflightOptions {
  maxFiles?: number;
  maxSingleFileSize?: number;
  maxTotalUncompressedSize?: number;
}

export interface ZipPreflightResult {
  ok: boolean;
  error?: string;
  fileCount?: number;
  totalUncompressed?: number;
}

const EOCD_SIGNATURE = 0x06054b50;
const CD_SIGNATURE = 0x02014b50;
const MAX_EOCD_SEARCH_BYTES = 22 + 65535;
const MAX_CENTRAL_DIR_ENTRIES = 350;

/**
 * Validates ZIP End-of-Central-Directory and Central Directory headers directly from memory
 * before instantiating AdmZip to prevent quadratic folder/entry allocation bombs and ZIP bombs.
 */
export function preflightZipCentralDirectory(
  buffer: Buffer,
  options: ZipPreflightOptions = {}
): ZipPreflightResult {
  const maxFiles = options.maxFiles ?? 300;
  const maxSingleFileSize = options.maxSingleFileSize ?? 15 * 1024 * 1024;
  const maxTotalUncompressedSize =
    options.maxTotalUncompressedSize ?? 150 * 1024 * 1024;

  if (!buffer || buffer.length < 22) {
    return { ok: false, error: "Invalid ZIP archive: buffer too small" };
  }

  const minSearchOffset = Math.max(0, buffer.length - MAX_EOCD_SEARCH_BYTES);
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= minSearchOffset; i--) {
    if (buffer.readUInt32LE(i) === EOCD_SIGNATURE) {
      const commentLength = buffer.readUInt16LE(i + 20);
      if (i + 22 + commentLength === buffer.length) {
        eocdOffset = i;
        break;
      }
    }
  }

  if (eocdOffset === -1) {
    return { ok: false, error: "Invalid ZIP archive: End of Central Directory not found" };
  }

  const diskNumber = buffer.readUInt16LE(eocdOffset + 4);
  const cdStartDisk = buffer.readUInt16LE(eocdOffset + 6);
  const diskEntries = buffer.readUInt16LE(eocdOffset + 8);
  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  const cdSize = buffer.readUInt32LE(eocdOffset + 12);
  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);

  if (
    diskNumber !== 0 ||
    cdStartDisk !== 0 ||
    diskEntries === 0xffff ||
    totalEntries === 0xffff ||
    cdSize === 0xffffffff ||
    cdOffset === 0xffffffff
  ) {
    return { ok: false, error: "Archive rejected: Multi-disk or ZIP64 archives are not supported" };
  }

  if (diskEntries !== totalEntries) {
    return { ok: false, error: "Invalid ZIP archive: inconsistent central directory entry count" };
  }

  if (totalEntries > MAX_CENTRAL_DIR_ENTRIES) {
    return {
      ok: false,
      error: `Archive rejected: Central directory exceeds maximum entries (${MAX_CENTRAL_DIR_ENTRIES})`,
    };
  }

  const cdEnd = cdOffset + cdSize;
  if (cdOffset > eocdOffset || cdEnd > eocdOffset) {
    return { ok: false, error: "Invalid ZIP archive: corrupt central directory offsets" };
  }

  let pos = cdOffset;
  let fileCount = 0;
  let totalUncompressed = 0;

  for (let i = 0; i < totalEntries; i++) {
    if (pos + 46 > cdEnd || buffer.readUInt32LE(pos) !== CD_SIGNATURE) {
      return { ok: false, error: "Invalid ZIP archive: corrupt central directory header" };
    }

    const compressionMethod = buffer.readUInt16LE(pos + 10);
    const compressedSize = buffer.readUInt32LE(pos + 20);
    const uncompressedSize = buffer.readUInt32LE(pos + 24);
    const fileNameLength = buffer.readUInt16LE(pos + 28);
    const extraFieldLength = buffer.readUInt16LE(pos + 30);
    const fileCommentLength = buffer.readUInt16LE(pos + 32);

    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff) {
      return { ok: false, error: "Archive rejected: ZIP64 entry sizes are not supported" };
    }

    if (fileNameLength === 0 || fileNameLength > 255) {
      return { ok: false, error: "Archive rejected: invalid entry filename length" };
    }

    const nextPos = pos + 46 + fileNameLength + extraFieldLength + fileCommentLength;
    if (nextPos > cdEnd) {
      return { ok: false, error: "Invalid ZIP archive: truncated central directory entry" };
    }

    const entryName = buffer.subarray(pos + 46, pos + 46 + fileNameLength).toString("utf8");
    pos = nextPos;

    if (
      entryName.includes("\0") ||
      entryName.includes("\\") ||
      entryName.startsWith("/")
    ) {
      return { ok: false, error: `Archive rejected: unsafe entry path "${entryName}"` };
    }

    const segments = entryName.replace(/\/+$/, "").split("/").filter(Boolean);
    if (segments.some((seg) => seg === ".." || seg === ".") || segments.length > 3) {
      return { ok: false, error: `Archive rejected: invalid path depth or traversal in "${entryName}"` };
    }

    // Skip explicit directory entries
    if (entryName.endsWith("/") && uncompressedSize === 0) {
      continue;
    }

    fileCount += 1;
    if (fileCount > maxFiles) {
      return {
        ok: false,
        error: `Archive rejected: Exceeds maximum allowed file count (${maxFiles})`,
      };
    }

    if (compressionMethod !== 0 && compressionMethod !== 8) {
      return {
        ok: false,
        error: `Archive rejected: Unsupported compression method (${compressionMethod}) for "${entryName}"`,
      };
    }

    if (compressionMethod === 0 && compressedSize !== uncompressedSize) {
      return {
        ok: false,
        error: `Archive rejected: Corrupt stored entry size metadata for "${entryName}"`,
      };
    }

    // Reject DEFLATED entries claiming 0 uncompressed bytes while containing non-trivial payloads
    if (compressionMethod === 8 && uncompressedSize === 0 && compressedSize > 2) {
      return {
        ok: false,
        error: `Archive rejected: Suspicious 0-byte DEFLATED entry "${entryName}"`,
      };
    }

    if (uncompressedSize > maxSingleFileSize) {
      return {
        ok: false,
        error: `Archive rejected: File "${entryName}" exceeds single-file size limit (${maxSingleFileSize / (1024 * 1024)} MB)`,
      };
    }

    totalUncompressed += uncompressedSize;
    if (totalUncompressed > maxTotalUncompressedSize) {
      return {
        ok: false,
        error: `Archive rejected: Exceeds total uncompressed size limit (${maxTotalUncompressedSize / (1024 * 1024)} MB)`,
      };
    }
  }

  if (pos !== cdEnd) {
    return { ok: false, error: "Invalid ZIP archive: central directory length mismatch" };
  }

  return { ok: true, fileCount, totalUncompressed };
}
