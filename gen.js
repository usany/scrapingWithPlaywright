import fs from 'fs';

// Read markdown files
const ko = fs.readFileSync('./globalCampusKo.md', 'utf8').split('\n');
const en = fs.readFileSync('./globalCampusEn.md', 'utf8').split('\n');

// Building definitions: [name, koStart, koEnd]
const bldgs = [
  ['gugo', 275, 604], ['gugon', 605, 692], ['guch', 693, 798],
  ['guwo', 799, 920], ['gum', 921, 1126], ['gug', 1127, 1205],
  ['gucha', 1206, 1239], ['gus', 1240, 1373], ['guh', 1374, 1381],
  ['gusi', 1382, 1441], ['guy', 1442, 1759], ['gudo', 1760, 1840],
  ['guha', 1841, 2025], ['gucl', 2026, 2175], ['guje', 2176, 2493],
  ['gugu', 2494, 2550], ['guc', 2551, 2600]
];

bldgs.forEach(([name, start, end]) => {
  const kd = ko.slice(start, end + 1).filter(l => l.trim() && !l.startsWith('#')).map(l => `  "${l}"`);
  const ed = en.slice(start, end + 1).filter(l => l.trim() && !l.startsWith('#')).map(l => `  "${l}"`);
  fs.writeFileSync(`${name}.ts`, `export const ${name}Ko = [\n${kd.join(',\n')}\n];\n\nexport const ${name}En = [\n${ed.join(',\n')}\n];`);
  console.log(`Created ${name}.ts`);
});
