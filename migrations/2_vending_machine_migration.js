const VendingMachine = artifacts.require("VendingMachine");

module.exports = function (deployer) {
  deployer.deploy(VendingMachine, 16);
};
