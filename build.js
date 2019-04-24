#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const WEIGHT_AND_STYLE_REGEXP = /^PublicSans-(\w*?)(Italic)?\./;
const WEIGHTS = new Map([
  ['Black', 900],
  ['ExtraBold', 800],
  ['Bold', 700],
  ['SemiBold', 600],
  ['Medium', 500],
  ['Regular', 400],
  ['Light', 300],
  ['ExtraLight', 200],
  ['Thin', 100],
]);

function getNumericWeight(name) {
  if (!name) {
    name = 'Regular';
  }

  if (!WEIGHTS.has(name))
    throw new Error(`Unknown weight ${name}`);

  return WEIGHTS.get(name);
}

function getfontFaceRule(filename) {
  const [_, weightName, style] = filename.match(WEIGHT_AND_STYLE_REGEXP);

  console.log(`Processing ${filename}...`)

  return `
@font-face {
  font-family: 'Public Sans';
  font-style: ${style || 'normal'};
  font-display: swap;
  font-weight: ${getNumericWeight(weightName)};
  src:
    local('Public Sans'),
    url('./files/${filename}2') format('woff2'),
    url('./files/${filename}') format('woff');
}
  `;
}

const css = fs
  .readdirSync('./files')
  .filter(filename => path.extname(filename) === '.woff')
  .reduce((buffer, filename) => buffer.concat(getfontFaceRule(filename)), '');

fs.writeFileSync('index.css', css.trim());
