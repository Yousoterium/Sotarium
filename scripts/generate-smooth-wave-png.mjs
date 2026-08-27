import fs from "fs";
import zlib from "zlib";

function createWavePNG(width = 1440, height = 1000) {
  const w = width;
  const h = height;

  const rawData = Buffer.alloc(h * (1 + w * 4));

  const waveAmplitude = 18; // Height of wave crests
  const baseline = 24; // Top offset

  let pos = 0;
  for (let y = 0; y < h; y++) {
    rawData[pos++] = 0; // Filter type: None

    for (let x = 0; x < w; x++) {
      // 5 complete smooth wave cycles across the width
      const rad = (x / w) * Math.PI * 10;
      const waveY = baseline + Math.sin(rad) * waveAmplitude;

      if (y >= waveY) {
        // Pure uniform vibrant cyan liquid
        rawData[pos++] = 0;   // R
        rawData[pos++] = 195; // G
        rawData[pos++] = 255; // B
        rawData[pos++] = 255; // A
      } else if (y >= waveY - 1.5) {
        const alphaFraction = 1 - (waveY - y) / 1.5;
        rawData[pos++] = 0;
        rawData[pos++] = 195;
        rawData[pos++] = 255;
        rawData[pos++] = Math.round(alphaFraction * 255);
      } else {
        rawData[pos++] = 0;
        rawData[pos++] = 0;
        rawData[pos++] = 0;
        rawData[pos++] = 0;
      }
    }
  }

  // Compress IDAT payload with zlib
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk("IHDR", ihdr);
  const idatChunk = makeChunk("IDAT", compressed);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  return png;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, "ascii");
  data.copy(chunk, 8);

  const crcData = chunk.subarray(4, 8 + len);
  const crc = crc32(crcData);
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

const pngData = createWavePNG(1440, 1000);
if (!fs.existsSync("assets")) fs.mkdirSync("assets");
if (!fs.existsSync("public")) fs.mkdirSync("public");
fs.writeFileSync("assets/wave.png", pngData);
fs.writeFileSync("public/wave.png", pngData);
console.log("Multi-wave PNG created (" + pngData.length + " bytes)");
