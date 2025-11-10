import fs from 'fs';

const ko = fs.readFileSync('seoulCampusKo.md', 'utf8');
const en = fs.readFileSync('seoulCampusEn.md', 'utf8');

function parseSection(data, code) {
  const lines = data.split('\n');
  const result = [];
  let inSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line starts a section with our code
    // Match patterns like "# Building Name code" or "# code"
    const isHeader = trimmed.startsWith('#') && (
      trimmed.endsWith(' ' + code) || 
      trimmed === '#' + code ||
      new RegExp(`\\s${code}\\s*$`).test(trimmed)
    );
    
    if (isHeader) {
      inSection = true;
      continue;
    }
    
    // Stop when we hit another section header (but not if it's the same code like seh)
    if (inSection && trimmed.startsWith('#')) {
      const nextHeaderHasCode = trimmed.endsWith(' ' + code) || new RegExp(`\\s${code}\\s*$`).test(trimmed);
      if (!nextHeaderHasCode) {
        break;
      }
    }
    
    // Collect room data (lines with tabs that aren't headers or empty)
    if (inSection && trimmed && !trimmed.startsWith('#') && trimmed.includes('\t')) {
      result.push(trimmed);
    }
  }
  
  return result;
}

function generateTSFile(code, koData, enData) {
  if (koData.length === 0 && enData.length === 0) {
    return `export const ${code}Ko = [\n  \n];
export const ${code}En = [\n  \n];
`;
  }
  
  const koArray = koData.map(line => `  "${line.replace(/"/g, '\\"')}"`).join(',\n');
  const enArray = enData.map(line => `  "${line.replace(/"/g, '\\"')}"`).join(',\n');
  
  return `export const ${code}Ko = [\n${koArray},\n];
export const ${code}En = [\n${enArray},\n];
`;
}

// Handle special cases
const codes = ['seb', 'sebe', 'sec', 'seg', 'segu', 'seh', 'seho', 'sej', 'seja', 'sek', 'sem', 'semu', 'semun', 'sen', 'sep', 'ses', 'sesh', 'sey'];

codes.forEach(code => {
  let koData = [];
  let enData = [];
  
  if (code === 'seh') {
    // seh has two sections: 생활과학대학 seh and 본관(대학원) seh
    // Parse both sections
    const koLines = ko.split('\n');
    const enLines = en.split('\n');
    let inSection = false;
    let sectionCount = 0;
    
    // Parse Korean - both sections
    for (let i = 0; i < koLines.length; i++) {
      const line = koLines[i];
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#') && trimmed.includes('seh')) {
        inSection = true;
        sectionCount++;
        continue;
      }
      
      if (inSection && trimmed.startsWith('#') && !trimmed.includes('seh')) {
        break;
      }
      
      if (inSection && trimmed && !trimmed.startsWith('#') && trimmed.includes('\t')) {
        koData.push(trimmed);
      }
    }
    
    // Parse English - both sections
    inSection = false;
    for (let i = 0; i < enLines.length; i++) {
      const line = enLines[i];
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#') && trimmed.includes('seh')) {
        inSection = true;
        continue;
      }
      
      if (inSection && trimmed.startsWith('#') && !trimmed.includes('seh')) {
        break;
      }
      
      if (inSection && trimmed && !trimmed.startsWith('#') && trimmed.includes('\t')) {
        enData.push(trimmed);
      }
    }
  } else {
    koData = parseSection(ko, code);
    enData = parseSection(en, code);
  }
  
  const content = generateTSFile(code, koData, enData);
  const filename = `${code}.ts`;
  
  fs.writeFileSync(filename, content);
  console.log(`Generated ${filename} with ${koData.length} Korean and ${enData.length} English entries`);
});

