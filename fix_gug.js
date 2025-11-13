const fs = require('fs');

// Read the file
const content = fs.readFileSync('C:\\Users\\dksck\\scrap\\gug.ts', 'utf8');

// Remove the invalid data entries
const fixed = content
  .replace(/  "\.	\.	글로벌관",\r?\n/g, '')
  .replace(/  "\.	\.	Global Hall",\r?\n/g, '');

// Write back
fs.writeFileSync('C:\\Users\\dksck\\scrap\\gug.ts', fixed, 'utf8');

console.log('Fixed gug.ts - removed invalid data entries');
