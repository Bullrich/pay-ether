import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser and metamask is running.
    const provider = window.web3.currentProvider;
    // Security measure for metamask
    // provider.enable();
    web3 = new Web3(provider);
} else
    web3 = null;

export default web3;