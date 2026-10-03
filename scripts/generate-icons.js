/**
 * CinePaz Android Launcher Icon Generator
 * Generates all adaptive icon XMLs, monochrome layer, background color,
 * legacy mipmap densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi), and master assets.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ASSETS_DIR = path.resolve('assets');
const ANDROID_RES_DIR = path.resolve('android/app/src/main/res');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

console.log('Generating CinePaz master app icons...');

// 1. Generate Master 1024x1024 Squircle Icon (exact replica of provided image)
// Uses layered rounded rectangle with 3D gradient, outer bevel border, top gloss highlight, and white play button
execSync(`convert -size 1024x1024 xc:none \
  \\( -size 1024x1024 xc:none -stroke "#800000" -strokewidth 12 -fill "#C40008" -draw "roundrectangle 24,24 1000,1000 240,240" \\) \
  \\( -size 1024x1024 xc:none -stroke "#FF4D55" -strokewidth 6 -fill "#EE111E" -draw "roundrectangle 36,36 988,988 224,224" \\) \
  -composite \
  \\( -size 1024x1024 xc:none -fill "rgba(255,255,255,0.4)" -draw "roundrectangle 100,50 924,280 120,120" -blur 0x12 \\) \
  -composite \
  \\( -size 1024x1024 xc:none -fill "#FFFFFF" -draw "polygon 370,270 760,512 370,754" \\) \
  -composite \
  "${path.join(ASSETS_DIR, 'icon.png')}"`);

// 2. Generate Master 1024x1024 Round Icon
execSync(`convert -size 1024x1024 xc:none \
  \\( -size 1024x1024 xc:none -stroke "#800000" -strokewidth 12 -fill "#C40008" -draw "circle 512,512 512,30" \\) \
  \\( -size 1024x1024 xc:none -stroke "#FF4D55" -strokewidth 6 -fill "#EE111E" -draw "circle 512,512 512,42" \\) \
  -composite \
  \\( -size 1024x1024 xc:none -fill "rgba(255,255,255,0.4)" -draw "ellipse 512,200 380,120 0 360" -blur 0x12 \\) \
  -composite \
  \\( -size 1024x1024 xc:none -fill "#FFFFFF" -draw "polygon 370,270 760,512 370,754" \\) \
  -composite \
  "${path.join(ASSETS_DIR, 'icon-round.png')}"`);

// 3. Generate Master 1024x1024 Adaptive Foreground (scaled to center ~66% safe zone)
execSync(`convert -size 1024x1024 xc:none \
  \\( "${path.join(ASSETS_DIR, 'icon.png')}" -resize 676x676 \\) \
  -geometry +174+174 -composite \
  "${path.join(ASSETS_DIR, 'icon-foreground.png')}"`);

console.log('✅ Master assets generated in assets/ (icon.png, icon-round.png, icon-foreground.png)');

// Helper function to write resource files
function writeResFile(relPath, content) {
  const fullPath = path.join(ANDROID_RES_DIR, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

export function generateAllRes() {
  console.log('Generating Android resources in android/app/src/main/res...');

  // 1. Background color XML (Exact matching hex: #E50000)
  writeResFile('values/ic_launcher_background.xml', `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#E50000</color>
</resources>
`);

  // 2. Monochrome layer for Android 13+ Themed Icons
  writeResFile('drawable/ic_launcher_monochrome.xml', `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M 43,36 L 73,54 L 43,72 Z" />
</vector>
`);

  // 3. Adaptive Icon XML: mipmap-anydpi-v26/ic_launcher.xml
  writeResFile('mipmap-anydpi-v26/ic_launcher.xml', `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
`);

  // 4. Adaptive Round Icon XML: mipmap-anydpi-v26/ic_launcher_round.xml
  writeResFile('mipmap-anydpi-v26/ic_launcher_round.xml', `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
`);

  // 5. Density sizes
  const densities = [
    { dir: 'mipmap-mdpi', legacy: 48, fg: 108 },
    { dir: 'mipmap-hdpi', legacy: 72, fg: 162 },
    { dir: 'mipmap-xhdpi', legacy: 96, fg: 216 },
    { dir: 'mipmap-xxhdpi', legacy: 144, fg: 324 },
    { dir: 'mipmap-xxxhdpi', legacy: 192, fg: 432 },
  ];

  for (const d of densities) {
    const targetDir = path.join(ANDROID_RES_DIR, d.dir);
    fs.mkdirSync(targetDir, { recursive: true });

    // ic_launcher.png (legacy squircle)
    execSync(`convert "${path.join(ASSETS_DIR, 'icon.png')}" -resize ${d.legacy}x${d.legacy} "${path.join(targetDir, 'ic_launcher.png')}"`);

    // ic_launcher_round.png (legacy round)
    execSync(`convert "${path.join(ASSETS_DIR, 'icon-round.png')}" -resize ${d.legacy}x${d.legacy} "${path.join(targetDir, 'ic_launcher_round.png')}"`);

    // ic_launcher_foreground.png (adaptive foreground)
    execSync(`convert "${path.join(ASSETS_DIR, 'icon-foreground.png')}" -resize ${d.fg}x${d.fg} "${path.join(targetDir, 'ic_launcher_foreground.png')}"`);

    console.log(`Generated ${d.dir} (Legacy: ${d.legacy}px, Foreground: ${d.fg}px)`);
  }

  // 6. Check / Update AndroidManifest.xml if present
  const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');
    if (!manifest.includes('android:icon="@mipmap/ic_launcher"')) {
      manifest = manifest.replace(/android:icon="[^"]*"/, 'android:icon="@mipmap/ic_launcher"');
    }
    if (!manifest.includes('android:roundIcon="@mipmap/ic_launcher_round"')) {
      manifest = manifest.replace(/android:roundIcon="[^"]*"/, 'android:roundIcon="@mipmap/ic_launcher_round"');
    }
    fs.writeFileSync(manifestPath, manifest);
    console.log('Updated AndroidManifest.xml');
  }

  console.log('✅ All Android launcher resources generated successfully!');
}

generateAllRes();
