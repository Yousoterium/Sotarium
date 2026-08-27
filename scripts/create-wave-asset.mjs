import fs from "fs";

// High resolution SVG wave
const waveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 400" width="2880" height="400">
  <defs>
    <linearGradient id="cyanWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="35%" stop-color="#00c6ff"/>
      <stop offset="70%" stop-color="#0072ff"/>
      <stop offset="100%" stop-color="#001845"/>
    </linearGradient>
  </defs>
  <path d="M0,100 C240,160 480,40 720,100 C960,160 1200,40 1440,100 C1680,160 1920,40 2160,100 C2400,160 2640,40 2880,100 L2880,400 L0,400 Z" fill="url(#cyanWaveGrad)"/>
</svg>`;

if (!fs.existsSync("assets")) {
  fs.mkdirSync("assets");
}
if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}

fs.writeFileSync("public/wave.svg", waveSvg);
fs.writeFileSync("assets/wave.svg", waveSvg);
console.log("Wave SVGs created successfully");
