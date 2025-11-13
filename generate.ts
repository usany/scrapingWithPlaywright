// This script creates all the TypeScript files based on globalCampusKo.md and globalCampusEn.md

import * as fs from 'fs';

const buildings = [
  'gugo', 'gugon', 'guch', 'guwo', 'gum', 'gug', 'gud', 'guo', 'gucha',
  'gus', 'guh', 'gusi', 'guy', 'gudo', 'guha', 'gucl', 'guje', 'gugu', 'guc'
];

// Read the markdown files
const koContent = fs.readFileSync('globalCampusKo.md', 'utf-8');
const enContent = fs.readFileSync('globalCampusEn.md', 'utf-8');

// Split by building sections
const koSections = koContent.split(/^# /m).filter(s => s.trim());
const enSections = enContent.split(/^# /m).filter(s => s.trim());

// Create a mapping for each building
const buildingMap: Record<string, { name: string, code: string }> = {};

koSections.forEach((section, idx) => {
  const lines = section.trim().split('\n');
  const header = lines[0];
  const match = header.match(/(.+?)\s+(\w+)$/);
  if (match) {
    const [, name, code] = match;
    buildingMap[code] = { name, code };
  }
});

// Generate files for each building
buildings.forEach(building => {
  const koSection = koSections.find(s => s.startsWith(`${buildingMap[building]?.name || ''} ${building}`));
  const enSection = enSections.find(s => s.startsWith(`${buildingMap[building]?.name || ''} ${building}`.replace(/(.+) \w+$/, '$1')));
  
  if (koSection && enSection) {
    const koLines = koSection.split('\n').slice(1).filter(line => line.trim() && !line.startsWith('#'));
    const enLines = enSection.split('\n').slice(1).filter(line => line.trim() && !line.startsWith('#'));
    
    const koData = koLines.map(line => `  "${line.replace(/"/g, '\\"')}"`).join(',\n');
    const enData = enLines.map(line => `  "${line.replace(/"/g, '\\"')}"`).join(',\n');
    
    const content = `export const ${building}Ko = [\n${koData}\n];\n\nexport const ${building}En = [\n${enData}\n];\n`;
    
    fs.writeFileSync(`${building}.ts`, content, 'utf-8');
    console.log(`Created ${building}.ts`);
  }
});
