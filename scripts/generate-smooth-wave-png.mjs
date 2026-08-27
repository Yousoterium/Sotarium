import fs from "fs";
import zlib from "zlib";

function createWavePNG(width = 1440, height = 360) {
  // Width and height in big-endian
  const w = width;
  const h = height;

  // We will build a truecolor + alpha (RGBA, 8 bits per channel) PNG
  // Raw image data: for each scanline, 1 filter byte (0) + 4 * w bytes
  const rawData = Buffer.alloc(h * (1 + w * 4));

  const waveHeight = 70; // Wave peak to trough amplitude
  const baseline = 90; // Top margin where wave starts

  let pos = 0;
  for (let y = 0; y < h; y++) {
    rawData[pos++] = 0; // Filter type: None

    for (let x = 0; x < w; x++) {
      // Smooth continuous double sine wave (repeating seamlessly at width)
      const rad = (x / w) * Math.PI * 4; // 2 full wave cycles
      const waveY = baseline + Math.sin(rad) * (waveHeight / 2);

      if (y >= waveY) {
        // Cyan / Blue liquid fill with subtle gradient
        const depth = (y - waveY) / (h - waveY);
        const r = Math.round(0 + depth * 0);
        const g = Math.round(210 - depth * 40);
        const b = Math.round(255 - depth * 30);
        const a = 255;

        rawData[pos++] = r;
        rawData[pos++] = g;
        rawData[pos++] = b;
        rawData[pos++] = a;
      } else if (y >= waveY - 1.5) {
        // Smooth antialiased edge
        const alphaFraction = 1 - (waveY - y) / 1.5;
        rawData[pos++] = 0;
        rawData[pos++] = 225;
        rawData[pos++] = 255;
        rawData[pos++] = Math.round(alphaFraction * 255);
      } else {
        // Transparent above wave
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
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

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

// Standard CRC32 table & function
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

const pngData = createWavePNG(1440, 360);
if (!fs.existsSync("assets")) fs.mkdirSync("assets");
if (!fs.existsSync("public")) fs.mkdirSync("public");
fs.writeFileSync("assets/wave.png", pngData);
fs.writeFileSync("public/wave.png", pngData);
console.log("Smooth wave PNG created successfully (" + pngData.length + " bytes)");
