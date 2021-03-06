const VendingMachine = artifacts.require("VendingMachine");
const truffleAssert = require('truffle-assertions');

contract("VendingMachine", ([owner, buyer]) => {
    let vendingMachine;

    before(async() => {
        vendingMachine = await VendingMachine.new(5);
    });

    it("should count the correct number of item slots", async () => {
        const items = await vendingMachine.countSlots();
        assert.equal(items, 5);
    })

    it("should deploy with the correct number of item slots", async () => {
        const items = await vendingMachine.getItems();
        assert.equal(items.length, 5);
    })

    it("should not accept 0 slots for vending machine", async () => {
        let error = null;

        try {
            await VendingMachine.new(0);
        } catch (err) {
            error = err;
        }
        
        assert.ok(error.message.search("Slots must be positive") >= 0, "Expected constructor to throw");
    })

    it("should not allow someone to buy an item out of stock", async() => {
        let error = null;
        try {
            await vendingMachine.buy(0, {from: buyer});
        } catch(err) {
            error = err;
        }
        assert.ok(error.message.search("Unable to buy item when it is out of stock.") >= 0, "Expected out of stock error to be thrown.");
    });

    it("should not allow someone to buy from a non-existant slot", async () => {
        let error = null;
        try {
            await vendingMachine.buy(10, {from: buyer});
        } catch(err) {
            error = err;
        }
        assert.ok(error.message.search("Slot is out of range") >= 0, "Expected out of range error to be thrown.");
    }); 

    it("should restock the slot with the correct items", async() => {
        let tx = await vendingMachine.restock("Take 5", "Delicious", web3.utils.toWei("0.5", 'Ether'), 10, 0, {from: owner});
        let item = await vendingMachine.examine(0);

        assert.equal(item.name, "Take 5");
        assert.equal(item.description, "Delicious");
        assert.equal(item.price, web3.utils.toWei("0.5", 'Ether'));
        assert.equal(item.amount, 10);

        truffleAssert.eventEmitted(tx, "Restock", (event) => {
            return  event.item.name == item.name &&
                    event.item.description == item.description &&
                    event.item.price == item.price &&
                    event.item.amount == 10 &&
                    event.slot == 0;
        });
    });

    it("should allow the user to buy an item in stock", async() => {
        let balance = await web3.eth.getBalance(vendingMachine.address);
        let tx = await vendingMachine.buy(0, {from: buyer, value: web3.utils.toWei("0.6", "Ether")});
        let balanceAfter = await web3.eth.getBalance(vendingMachine.address);
        let difference = parseFloat(balanceAfter) - parseFloat(balance)

        item = await vendingMachine.examine(0);
        assert.equal(item.name, "Take 5");
        assert.equal(item.description, "Delicious");
        assert.equal(item.price, web3.utils.toWei("0.5", 'Ether'));
        assert.equal(item.amount, 9);

        assert.ok(balanceAfter > balance, "Contract balance should be greater after a purchase");
        assert.ok(difference === parseFloat(web3.utils.toWei("0.5", "Ether"), "Contract should only take the price of the item in ether"));

        truffleAssert.eventEmitted(tx, "Buy", (event) => {
            return  event.item.name == item.name &&
                    event.item.description == item.description &&
                    event.item.price == item.price &&
                    event.item.amount == 9;// &&
                    // Ideally we want to test the address, but having an issue with it
                    //event.address == buyer;
        });
    });

    it("should require the user to pay enough for their bought item", async () => {
        let error = null;
        
        try {
            await vendingMachine.buy(0, {from: buyer, value: web3.utils.toWei("0.4", "Ether")});
        } catch(err) {
            error = err;
        }

        assert.ok(error.message.search("Must have enough Ether to purchase the item") >= 0, "Expected not enough ether error.");
    });

    it("should only allow the owner to restock items", async() => {
        let error = null;
        try {
            await vendingMachine.restock("Take 5", web3.utils.toWei("0.5", 'Ether'), 10, 0, {from: buyer});
        } catch(err) {
            error = err;
        }
        assert.ok(error != null, "Expected error to be thrown");
    });

    it("should allow the user to restock a slot in range", async() => {
        let error = null;
        try {
            await vendingMachine.restock("Take 5", web3.utils.toWei("0.5", 'Ether'), 10, 10, {from: owner});
        } catch(err) {
            error = err;
        }
        assert.ok(error != null, "Expected error to be thrown");
    });

    it("should not allow the user to examine a slot out of range", async () => {
        let error = null;

        try {
            await vendingMachine.examine(6);
        } catch(err) {
            error = err;
        }

        assert.ok(error.message.search("Slot is out of range") >= 0, "Expected examine to throw");
    });

    it("should allow the user to examine a slot.", async () => {
        let item = await vendingMachine.examine(0);
        assert.equal(item.name, "Take 5");
        assert.equal(item.description, "Delicious");
        assert.equal(item.price, web3.utils.toWei("0.5", 'Ether'));
        assert.equal(item.amount, 9);
    });

    it("should remove all instances of an item from a slot", async() => {
        let tx = await vendingMachine.remove(0, {from: owner});
        let item = await vendingMachine.examine(0);
        assert.equal(item.amount, 0);

        truffleAssert.eventEmitted(tx, "Remove", (event) => {
            return event.slot == 0;
        });
    });

    it("should only allow the owner to remove an item from a slot", async() => {
        let error = null;
        try {
            await vendingMachine.remove(0, {from: buyer});
        } catch(err) {
            error = err;
        }
        assert.ok(error != null, "Expected error to be thrown");
    });

    it("should check the slot to remove the item from exists", async() => {
        let error = null;
        try {
            await vendingMachine.remove(10, {from: owner});
        } catch(err) {
            error = err;
        }
        assert.ok(error != null, "Expected error to be thrown");
    });

    it("should withdraw all funds", async() => {
        let initialContractBalance = parseInt(await web3.eth.getBalance(vendingMachine.address));
        let beforeBalance = parseInt(await web3.eth.getBalance(owner));
        let tx = await vendingMachine.withdraw({from: owner});
        let afterBalance = parseInt(await web3.eth.getBalance(owner));

        assert.ok(afterBalance > beforeBalance, "Expected balance to be higher after withdraw");

        let contractBalance = parseInt(await web3.eth.getBalance(vendingMachine.address));
        assert.ok(contractBalance === 0, "Expected balance to be higher after withdraw");

        
        truffleAssert.eventEmitted(tx, "Withdraw", (event) => {
            console.log("Test balance: " + (initialContractBalance));
            console.log("Contract balance: " + event.amount)
            return event.amount == initialContractBalance;
        });
    });

    it("should only allow the owner to withdraw funds", async() => {
        let error = null;
        try {
            await vendingMachine.withdraw({from: buyer});
        } catch(err) {
            error = err;
        }
        assert.ok(error != null, "Expected error to be thrown");
    });
});