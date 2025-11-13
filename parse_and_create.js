const fs = require('fs');

// Read the Korean and English files
const koContent = fs.readFileSync('globalCampusKo.md', 'utf8');
const enContent = fs.readFileSync('globalCampusEn.md', 'utf8');

// Parse sections (split by headers that start with #)
const koSections = koContent.split(/\n(?=# )/);
const enSections = enContent.split(/\n(?=# )/);

console.log(`Korean sections: ${koSections.length}`);
console.log(`English sections: ${enSections.length}`);

// Map building names to filenames
const buildingMap = {
  '우정원 guw': 'guw',
  '제2기숙사 guj': 'guj',
  '공학관 gugo': 'gugo',
  '공학실험동 gugon': 'gugon',
  '체육대학관 guch': 'guch',
  '외국어대학관 guwo': 'guwo',
  '멀티미디어교육관 gum': 'gum',
  '글로벌관 gug': 'gug',
  '선승관 gucha': 'gucha',
  '생명과학대학 gus': 'gus',
  '한방재료가공학(경희보감) guh': 'guh',
  '실험연구동 gusi': 'gusi',
  '예술·디자인대학관 guy': 'guy',
  '국제·경영대학관 gudo': 'gudo',
  '학생회관 guh': 'guh',
  '중앙도서관(대학본부) gucl': 'gucl',
  '전자정보/응용과학대학관 guje': 'guje',
  '국제학관 gugu': 'gugu',
  '천문대 guc': 'guc'
};

// Create files for each building
const filesToCreate = ['guw', 'guj', 'gugo', 'gugon', 'guch', 'guwo', 'gum', 'gug', 'gucha', 'gus', 'guh', 'gusi', 'guy', 'gudo', 'gucl', 'guje', 'gugu', 'guc'];

filesToCreate.forEach(filename => {
  // Find corresponding section in Ko and En
  let koSection = null;
  let enSection = null;
  
  for (let i = 0; i < koSections.length; i++) {
    if (koSections[i].includes(`${filename}\n`)) {
      koSection = koSections[i];
      enSection = enSections[i];
      break;
    }
  }
  
  if (!koSection || !enSection) {
    console.log(`Warning: Could not find section for ${filename}`);
    return;
  }
  
  // Extract the room data (lines after the header)
  const koLines = koSection.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const enLines = enSection.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  // Build the export arrays
  const koArray = koLines.map(line => `  "${line.replace(/"/g, '\\"')}"`).join(',\n');
  const enArray = enLines.map(line => `  "${line.replace(/"/g, '\\"')}"`).join(',\n');
  
  // Get building name from header
  const koHeader = koSection.match(/#\s+(.+)/)[1].trim();
  const enHeader = enSection.match(/#\s+(.+)/)[1].trim();
  
  // Create file content
  const content = `export const ${filename}Ko = [\n${koArray}\n];\n\nexport const ${filename}En = [\n${enArray}\n];`;
  
  // Write file
  fs.writeFileSync(`${filename}.ts`, content, 'utf8');
  console.log(`Created ${filename}.ts`);
});

console.log('All files created successfully!');
