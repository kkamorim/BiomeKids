const fs = require('fs');
const readline = require('readline');

const linesToFind = [160814, 234025, 233459, 152041, 151927, 151498, 93157, 3843];
const results = {};

async function inspect() {
  const rl = readline.createInterface({
    input: fs.createReadStream('scratch/test-final.bundle'),
    crlfDelay: Infinity
  });
  let lineNum = 0;
  let lastDef = '';
  for await (const line of rl) {
    lineNum++;
    if (line.includes('__d(function')) {
      lastDef = line.slice(-100);
    }
    if (linesToFind.includes(lineNum)) {
      results[lineNum] = { line: line.trim(), module: lastDef };
    }
  }
  console.log(JSON.stringify(results, null, 2));
}
inspect();
