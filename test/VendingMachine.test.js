const VendingMachine = artifacts.require("VendingMachine");

contract("VendingMachine", accounts => {
    it("should deploy with the correct number of item slots", async () => {
        const vm = await VendingMachine.new(5);
        const items = await vm.countSlots();
        assert.equal(items, 5);
    })
});