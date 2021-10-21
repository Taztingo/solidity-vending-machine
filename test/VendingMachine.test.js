const VendingMachine = artifacts.require("VendingMachine");

contract("VendingMachine", ([owner, buyer]) => {
    let vendingMachine;

    before(async() => {
        vendingMachine = await VendingMachine.new(5);
    });

    it("should deploy with the correct number of item slots", async () => {
        const items = await vendingMachine.countSlots();
        assert.equal(items, 5);
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

    it("should require the user to pay enough for their bought item", async () => {
        assert.fail("Not yet implemented");
    });

    it("should refund the user excess for their bought item", async () => {
        assert.fail("Not yet implemented");
    }); 

    it("should restock the slot with the correct items", async() => {
        await vendingMachine.restock("Take 5", web3.utils.toWei("0.5", 'Ether'), 10, 0, {from: owner});
        let item = await vendingMachine.examine(0);

        assert.equal(item.name, "Take 5");
        assert.equal(item.price, web3.utils.toWei("0.5", 'Ether'));
        assert.equal(item.amount, 10);
    });

    it("should allow the user to buy an item in stock", async() => {
        let item = await vendingMachine.buy(0, {from: buyer, value: web3.utils.toWei("0.5", "Ether")});
        assert.equal(item, 1);

        item = await vendingMachine.examine(0);
        assert.equal(item.name, "Take 5");
        assert.equal(item.price, web3.utils.toWei("0.5", 'Ether'));
        assert.equal(item.amount, 9);

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
        assert.equal(item.price, web3.utils.toWei("0.5", 'Ether'));
        assert.equal(item.amount, 9);
    });

    it("should remove all instances of an item from a slot", async() => {
        await vendingMachine.remove(0, {from: owner});
        let item = await vendingMachine.examine(0);
        assert.equal(item.amount, 0);
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
        assert.fail("Not yet implemented");
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