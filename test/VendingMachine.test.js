const VendingMachine = artifacts.require("VendingMachine");

contract("VendingMachine", accounts => {
    it("should deploy with the correct number of item slots", async () => {
        const vm = await VendingMachine.new(5);
        const items = await vm.countSlots();
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

    it("should allow the user to buy an item in stock", async() => {
        assert.fail("Not yet implemented");
    });

    it("should not allow someone to buy an item out of stock", async() => {
        assert.fail("Not yet implemented");
    });

    it("should not allow someone to buy from a non-existant slot", async () => {
        assert.fail("Not yet implemented");
    }); 

    it("should require the user to pay enough for their bought item", async () => {
        assert.fail("Not yet implemented");
    });

    it("should refund the user excess for their bought item", async () => {
        assert.fail("Not yet implemented");
    }); 

    it("should not allow the user to examine a slot out of range", async () => {
        assert.fail("Not yet implemented");
    });

    it("should restock the slot with the correct items", async() => {
        assert.fail("Not yet implemented");
    });

    it("should only allow the owner to restock items", async() => {
        assert.fail("Not yet implemented");
    });

    it("should only allow the user to restock a slot in range", async() => {
        assert.fail("Not yet implemented");
    });

    it("should remove all instances of an item from a slot", async() => {
        assert.fail("Not yet implemented");
    });

    it("should only allow the owner to remove an item from a slot", async() => {
        assert.fail("Not yet implemented");
    });

    it("should check the slot to remove the item from exists", async() => {
        assert.fail("Not yet implemented");
    });

    it("should withdraw all funds", async() => {
        assert.fail("Not yet implemented");
    });

    it("should only allow the owner to withdraw funds", async() => {
        assert.fail("Not yet implemented");
    });
});