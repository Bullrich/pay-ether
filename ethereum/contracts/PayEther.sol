pragma solidity 0.4.25;

contract PayEther {
    mapping(address => bool) subscribedAddress;
    uint64 private peopleThatPaid;
    uint private minimumAmountToPay;
    address private owner;

    constructor(uint minimumAmount) public {
        owner = msg.sender;
        minimumAmountToPay = minimumAmount;
        peopleThatPaid = 0;
    }

    function payToSatisfyCuriosity() payable public {
        require(msg.value > minimumAmountToPay);
        owner.transfer(msg.value);
        subscribedAddress[msg.sender] = true;
        peopleThatPaid++;
    }

    function findHowManyPeoplePayed() view public returns (uint64){
        require(subscribedAddress[msg.sender]);
        return peopleThatPaid;
    }

    function changeMinimumAmount(uint minimumAmount) public {
        require(msg.sender == owner);
        minimumAmountToPay = minimumAmount;
    }
}
