const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const Web3 = require('web3');
const compiledContract = require('./compile');
const path = require('path');
const Mocha = require('mocha');
const wallet = require('./wallet.json');

const mocha = new Mocha();

const provider = new HDWalletProvider(wallet.memonic, `https://rinkeby.infura.io/v3/${wallet.api}`);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const contractABI = JSON.parse(compiledContract.interface);

    const result = await new web3.eth.Contract(contractABI)
        .deploy({data: '0x' + compiledContract.bytecode, arguments: [wallet.amountToPay]})
        .send({gas: '1000000', from: accounts[0]});

    const address = result.options.address;

    const contractData = {
        amountToPay: wallet.amountToPay,
        address: address,
        interface: contractABI
    };

    console.log('Contract deployed to', address);
    return contractData;
};

const writeToFile = (file, value) => {
    const fileName = path.resolve(__dirname, '..', 'src', file);
    fs.writeFile(fileName, value, function (err, data) {
        if (err) console.error(err);
        console.log(`Saved ${fileName}`);
    });
};

const testFile = 'test/PayEther.test.js';
mocha.addFile(testFile);

mocha.run(async function (failures) {
    if (failures !== 0) {
        provider.engine.stop();
        console.error('Failed one test! Please fix before deploying.');
        process.exit(13);
    }

    deploy().then(contract => writeToFile('contractData.json', JSON.stringify(contract))).catch(console.log);
    provider.engine.stop();
});
