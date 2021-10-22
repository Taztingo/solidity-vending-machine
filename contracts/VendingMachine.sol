// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VendingMachine is Ownable {
    
    Item[] items;
    event Buy (address buyer, Item item);
    event Restock (uint slot, Item item);
    event Withdraw(uint amount);
    event Remove(uint slot);
    
    struct Item {
        string name;
        uint price;
        uint amount;
    }
    
    constructor(uint slots) {
        require(slots > 0, "Slots must be positive");
        for(uint i = 0; i < slots; i++) {
            items.push(Item({
                name: "",
                price: 0,
                amount: 0
            }));
        }
    }
    
    modifier slotExists(uint slot) {
        require(slot < items.length, "Slot is out of range");
        _;
    }
    
    modifier inStock(uint slot) {
        require(items[slot].amount > 0, "Unable to buy item when it is out of stock.");
        _;
    }

    function countSlots() external view returns (uint) {
        return items.length;
    }
    
    // Anyone can remove 1 item for cash
    function buy(uint slot) external payable slotExists(slot) inStock(slot) {
        Item storage item = items[slot];
        
        // Verify enough cash and refund remaining
        require(msg.value >= item.price, "Must have enough Ether to purchase the item");
        payable(msg.sender).transfer(msg.value - item.price);
        
        // Subtract an item from inventory
        item.amount--;

        // We want to emit
        emit Buy(msg.sender, item);
    }
    
    // Anyone can view items
    // Handled by automatic getters
    // We can test the gas on this vs a custom method
    
    // Anyone can examine a slot
    function examine(uint slot) external view slotExists(slot) returns (Item memory) {
        return items[slot];
    }
    
    // Owner can add 1 or n item
    function restock(string calldata name, uint price, uint amount, uint slot) external onlyOwner slotExists(slot) {
        Item storage item = items[slot];
        item.name = name;
        item.price = price;
        item.amount = amount;

        emit Restock(slot, item);
    }
    
    // Owner can remove all items for free
    function remove(uint slot) external onlyOwner slotExists(slot) {
        Item storage item = items[slot];
        item.amount = 0;
        emit Remove(slot);
    }
    
    // Owner can withdraw cash
    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit Withdraw(balance);
    }
}