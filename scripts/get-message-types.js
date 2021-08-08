const fs = require('fs');

const inFile = './src/runtime.js';
const outFile = './frontend/src/types/browser-message-types.ts';

/**
 * @param { string } snakeCase
 */
const snakeCaseToCamelCase = snakeCase => {
  const words = snakeCase.split('_');
  const firstWord = words.shift();

  const camelCaseWords = words.map(
    word => `${word.toUpperCase().substr(0, 1)}${word.substr(1)}`
  );

  return `${firstWord}${camelCaseWords.join('')}`;
};

const fContent = new String(fs.readFileSync(inFile));
const content = fContent.split('\n');
const cases = content
  .map(line => line.match(/case '(.+)':/))
  .filter(match => !!match)
  .map(match => match[1]);

const fHandle = fs.openSync(outFile, 'w');
fs.writeSync(fHandle, 'enum MessageType {');
fs.writeSync(
  fHandle,
  cases.reduce(
    (prev, current) => `${prev}${snakeCaseToCamelCase(current)}='${current}',`,
    ''
  )
);
fs.writeSync(fHandle, '};\nexport default MessageType;');
fs.closeSync(fHandle);
