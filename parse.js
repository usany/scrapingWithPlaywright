import fs from 'fs';

const ko = fs.readFileSync('seoulCampusKo.md', 'utf8');
const en = fs.readFileSync('seoulCampusEn.md', 'utf8');

function parse(data, code) {
  const lines = data.split('\n');
  let inSection = false;
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line starts a section with our code
    if (trimmed.startsWith('#') && (trimmed.endsWith(' ' + code) || trimmed.includes(' ' + code + '\n') || trimmed === '# ' + code)) {
      inSection = true;
      continue;
    }
    
    // If we hit another section, stop (but allow multiple sections for same code like seh)
    if (inSection && trimmed.startsWith('#') && !trimmed.includes(' ' + code) && !trimmed.endsWith(' ' + code)) {
      // Check if it's a continuation (like seh appears twice)
      if (code !== 'seh' || !trimmed.includes('seh')) {
        break;
      }
    }
    
    // Collect room data
    if (inSection) {
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('\t')) {
        result.push(trimmed);
      }
      // Stop at empty line if next line is a new section
      if (trimmed === '' && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith('#') && !nextLine.includes(' ' + code) && !nextLine.endsWith(' ' + code)) {
          if (code !== 'seh' || !nextLine.includes('seh')) {
            break;
          }
        }
      }
    }
  }
  
  return result;
}

const codes = ['seb', 'sebe', 'sec', 'seg', 'segu', 'seh', 'seho', 'sej', 'seja', 'sek', 'sem', 'semu', 'semun', 'sen', 'sep', 'ses', 'sesh', 'sey'];

const results = {};
codes.forEach(code => {
  // For seh, we need to handle two sections
  if (code === 'seh') {
    const ko1 = parse(ko, code);
    const en1 = parse(en, code);
    // Parse second section
    const koLines = ko.split('\n');
    const enLines = en.split('\n');
    let foundFirst = false;
    let ko2 = [];
    let en2 = [];
    let inSecond = false;
    
    for (let i = 0; i < koLines.length; i++) {
      if (koLines[i].includes('본관(대학원) seh')) {
        inSecond = true;
        continue;
      }
      if (inSecond && koLines[i].trim().startsWith('#') && !koLines[i].includes('seh')) {
        break;
      }
      if (inSecond && koLines[i].trim() && !koLines[i].trim().startsWith('#') && koLines[i].includes('\t')) {
        ko2.push(koLines[i].trim());
      }
    }
    
    for (let i = 0; i < enLines.length; i++) {
      if (enLines[i].includes('Main Building (Graduate) seh')) {
        inSecond = true;
        continue;
      }
      if (inSecond && enLines[i].trim().startsWith('#') && !enLines[i].includes('seh')) {
        break;
      }
      if (inSecond && enLines[i].trim() && !enLines[i].trim().startsWith('#') && enLines[i].includes('\t')) {
        en2.push(enLines[i].trim());
      }
    }
    
    results[code] = { ko: [...ko1, ...ko2], en: [...en1, ...en2] };
  } else {
    const koData = parse(ko, code);
    const enData = parse(en, code);
    results[code] = { ko: koData, en: enData };
  }
  console.log(`${code}: ${results[code].ko.length} Korean, ${results[code].en.length} English`);
});

// Write results to a JSON file for inspection
fs.writeFileSync('parsed_data.json', JSON.stringify(results, null, 2));

