// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VendingMachine is Ownable {
    
    Item[] items;
    
    struct Item {
        string name;
        uint price;
        uint amount;
    }
    
    constructor(uint slots) {
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
    function buy(uint slot) external payable slotExists(slot) inStock(slot) returns (Item memory) {
        Item storage item = items[slot];
        
        // Verify enough cash
        require(msg.value >= item.price, "Must have enough Ether to purchase the item");
        
        // We should be able to refund
        
        // Subtract an item from inventory
        item.amount--;
        
        // Return a copy of the bought item
        return Item(item.name, item.price, 1);
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
    }
    
    // Owner can remove all items for free
    function remove(uint slot) external onlyOwner slotExists(slot) {
        Item storage item = items[slot];
        item.amount = 0;
    }
    
    // Owner can withdraw cash
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}