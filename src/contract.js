import web3 from './web3';
import contractData from './contractData.json';

let contract = null;

if (web3 != null)
    contract = new web3.eth.Contract(contractData.interface, contractData.address);

export default contract;
