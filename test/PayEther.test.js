const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../ethereum/compile');
const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let payContract;
const defaultGas = '3000000';

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    payContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [web3.utils.toWei('0.09', 'ether')]})
        .send({from: accounts[0], gas: '1000000'});

    payContract.setProvider(provider);
});

describe('Pay Ether', () => {
    it('deploys a contract', () => {
        assert.ok(payContract.options.address);
    });

    verifyAddressCanNotSeeHowManyPeoplePayed = async () => {
        try {
            await payContract.methods.findHowManyPeoplePayed().call();
            assert(false);
        } catch (e) {
            assert(e);
        }
    };

    it('should not allow to see how many people payed without paying', async () => {
        await verifyAddressCanNotSeeHowManyPeoplePayed();
    });

    it('should allow to see how many people payed after paying', async () => {
        await verifyAddressCanNotSeeHowManyPeoplePayed();
        await payContract.methods.payToSatisfyCuriosity().send({from: accounts[0], value: web3.utils.toWei('1', 'ether')});
        const peopleThatPayed = await payContract.methods.findHowManyPeoplePayed().call();
        console.log('People that payed: ' + peopleThatPayed);
        assert(peopleThatPayed === '1');
    });

    it('should transfer ether when paying to manager', async () => {
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await payContract.methods.payToSatisfyCuriosity().send({from: accounts[1], value: web3.utils.toWei('1', 'ether')});
        const currentBalance = await web3.eth.getBalance(accounts[0]);
        console.log(`Initial balance was ${initialBalance} and current balance is ${currentBalance}`);
        assert(parseInt(currentBalance) > parseInt(initialBalance));
    });

    it('should allow to change the minimum amount to pay', async () => {
        payZeroPointOneEther = async() =>{
            await payContract.methods.payToSatisfyCuriosity().send({
                from: accounts[0],
                value: web3.utils.toWei('0.1', 'ether'),
                gas: defaultGas
            });
        };

        await payZeroPointOneEther();

        await payContract.methods.changeMinimumAmount(web3.utils.toWei('0.1', 'ether')).send({
            from: accounts[0],
            gas: defaultGas
        });
        try{
            await payZeroPointOneEther();
            assert(false);
        }
        catch (e) {
            assert(e);
        }
        const peopleThatPayed = await payContract.methods.findHowManyPeoplePayed().call();
        assert(peopleThatPayed === '1');
    });

    it('should increment the counter when more people pay', async()=>{
        payZeroPointOneEther = async(account) =>{
            await payContract.methods.payToSatisfyCuriosity().send({
                from: account,
                value: web3.utils.toWei('0.1', 'ether'),
                gas: defaultGas
            });
        };

        await payZeroPointOneEther(accounts[0]);
        let peopleThatPayed = await payContract.methods.findHowManyPeoplePayed().call({from: accounts[0]});
        assert(peopleThatPayed === '1');

        await payZeroPointOneEther(accounts[1]);
        peopleThatPayed = await payContract.methods.findHowManyPeoplePayed().call({from: accounts[1]});
        assert(peopleThatPayed === '2');

        await payZeroPointOneEther(accounts[2]);
        peopleThatPayed = await payContract.methods.findHowManyPeoplePayed().call({from: accounts[2]});
        assert(peopleThatPayed === '3');
    })
});
