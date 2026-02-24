const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const requiredFiles = [
    'index.html',
    'css/style.css',
    'js/main.js',
    'assets/images/logo.png',
    'assets/images/hero/hero_1.png',
    'assets/images/hero/hero_2.png',
    'assets/images/hero/hero_3.png',
    'assets/images/hero/hero_4.png',
    'assets/images/hero/hero_5.png',
    'assets/images/gallery/gallery_1.png',
    'assets/images/gallery/gallery_2.png',
    'assets/images/gallery/gallery_3.png',
    'assets/images/gallery/gallery_4.png',
    'assets/images/gallery/gallery_5.png',
    'assets/images/gallery/gallery_6.png',
    '.gitignore',
    'README.md'
];

console.log('Verifying project structure...\n');

let allPassed = true;
let passCount = 0;

requiredFiles.forEach(file => {
    const filePath = path.join(projectDir, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`  [PASS] ${file} (${sizeKB} KB)`);
        passCount++;
    } else {
        console.error(`  [FAIL] ${file} — MISSING`);
        allPassed = false;
    }
});

console.log(`\n${passCount}/${requiredFiles.length} files verified.`);

if (allPassed) {
    console.log('✅ All required files are present!');
} else {
    console.error('❌ Some files are missing.');
    process.exit(1);
}
