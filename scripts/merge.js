const fs = require('fs');

const mergeFiles = (outFile, files) => {
  const stream = fs.createWriteStream(`js/${outFile}`);

  files.forEach(file => {
    const bytes = fs.readFileSync(file);
    stream.write(`// ${file}\n\n`);
    stream.write(bytes);
    stream.write('\n// END OF FILE\n');
  });

  stream.close();
}

mergeFiles('src.js', [
    'src/util.js',
    'src/worker-communication.js',
    'src/webRequest.js',
    'src/context.js',
    'src/runtime.js'
]);
