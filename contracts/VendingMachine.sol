// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
  * @title VendingMachine
  * @author Matthew Witkowski
  * @dev A generic vending machine that can store purchasable items.
  * Users can purchase items with Ether and they will be given
  * an item in return.
  */
contract VendingMachine is Ownable {
    
    Item[] items;
    event Buy (address buyer, Item item);
    event Restock (uint slot, Item item);
    event Withdraw(uint amount);
    event Remove(uint slot);
    
    struct Item {
        string name;
        string description;
        uint price;
        uint amount;
    }
    
    /**
     * @dev Builds the smart contract and creates n slots.
     * There must be at least 1 slot for a valid VendingMachine.
     */
    constructor(uint slots) {
        require(slots > 0, "Slots must be positive");
        for(uint i = 0; i < slots; i++) {
            items.push(Item({
                name: "",
                description: "",
                price: 0,
                amount: 0
            }));
        }
    }
    
    /**
     * @dev Verifies that the slot number is in bounds.
     */
    modifier slotExists(uint slot) {
        require(slot < items.length, "Slot is out of range");
        _;
    }
    
    /**
     * @dev Verifies that their is at least 1 item in the slot.
     */
    modifier inStock(uint slot) {
        require(items[slot].amount > 0, "Unable to buy item when it is out of stock.");
        _;
    }

    /**
     * @dev A simple view to obtain the number of slots in the VendingMachine.
     * @return The number of slots in the VendingMachine.
     */
    function countSlots() external view returns (uint) {
        return items.length;
    }

    /**
     * @dev A simple view to obtain all the items in the vending machine.
     * @return All the items in the VendingMachine.
     */
    function getItems() external view returns (Item[] memory) {
        return items;
    }
    
    /**
     * @dev Purchases an item in the slot.
     * A Buy event is emitted to track the purchase.
     */
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
    
    /**
     * @dev Returns the item information in the slot the user wants to examine.
     * @return An Item is returned containing item, price, and number in stock.
     */
    function examine(uint slot) external view slotExists(slot) returns (Item memory) {
        return items[slot];
    }
    
    /**
     * @dev Replaces all items in a slot with new items.
     * The data in the map is overwritten to simplify it.
     * A Restock event is emitted from this function containing the slot and the item.
     */
    function restock(string calldata name, string calldata description, uint price, uint amount, uint slot) external onlyOwner slotExists(slot) {
        Item memory item = Item (name, description, price, amount);
        items[slot] = item;

        emit Restock(slot, item);
    }
    
    /**
     * @dev Removes all instances of an item in a slot.
     * A Remove event is emitted with the slot impacted.
     */
    function remove(uint slot) external onlyOwner slotExists(slot) {
        Item storage item = items[slot];
        item.amount = 0;
        emit Remove(slot);
    }
    
    /**
     * @dev Moves the VendingMachine's funds into the owner's account.
     * A Withdraw event is emitted with the balance.
     */
    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit Withdraw(balance);
    }
}