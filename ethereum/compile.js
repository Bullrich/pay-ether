const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'PayEther.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const contract = solc.compile(source, 1).contracts[':PayEther'];

module.exports = contract;
