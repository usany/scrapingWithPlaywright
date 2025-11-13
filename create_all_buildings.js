// Script to extract and create all building files from the markdown files
const fs = require('fs');

const koContent = fs.readFileSync('globalCampusKo.md', 'utf8');
const enContent = fs.readFileSync('globalCampusEn.md', 'utf8');

const koLines = koContent.split('\n');
const enLines = enContent.split('\n');

// Map of building code to line range [koStart, koEnd, enStart, enEnd]
const buildings = {
  'gugo': [275, 604, 275, 604],
  'gugon': [605, 692, 605, 692],
  'guch': [693, 798, 693, 798],
  'guwo': [799, 920, 799, 920],
  'gum': [921, 1126, 921, 1126],
  'gug': [1127, 1205, 1127, 1205],
  'gucha': [1206, 1239, 1206, 1239],
  'gus': [1240, 1373, 1240, 1373],
  'guh': [1374, 1381, 1374, 1381],
  'gusi': [1382, 1441, 1382, 1441],
  'guy': [1442, 1759, 1442, 1759],
  'gudo': [1760, 1840, 1760, 1840],
  'gucl': [2026, 2175, 2026, 2175],
  'guje': [2176, 2493, 2176, 2493],
  'gugu': [2494, 2550, 2494, 2550],
  'guc': [2551, 2600, 2551, 2600]
};

// Note: guh appears twice - lines 1374-1381 and 1841-2025
// Let's handle the student center (학생회관) separately
buildings['guha'] = [1841, 2025, 1841, 2025]; // 학생회관

for (const [code, [koStart, koEnd, enStart, enEnd]] of Object.entries(buildings)) {
  try {
    // Extract lines (subtract 1 because arrays are 0-indexed)
    const koData = koLines.slice(koStart, koEnd + 1)
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => `  "${line.replace(/"/g, '\\"')}"`);
    
    const enData = enLines.slice(enStart, enEnd + 1)
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => `  "${line.replace(/"/g, '\\"')}"`);
    
    if (koData.length === 0 || enData.length === 0) {
      console.log(`Warning: No data for ${code}`);
      continue;
    }
    
    const content = `export const ${code}Ko = [\n${koData.join(',\n')}\n];\n\nexport const ${code}En = [\n${enData.join(',\n')}\n];`;
    
    fs.writeFileSync(`${code}.ts`, content, 'utf8');
    console.log(`✓ Created ${code}.ts (${koData.length} lines)`);
  } catch (err) {
    console.error(`Error creating ${code}.ts:`, err.message);
  }
}

console.log('\nAll files created!');
