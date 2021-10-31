import VendingMachine from "./contracts/VendingMachine.json"

const options = {
    web3: {
      block: false,
    },
    polls: {
      accounts: 1000
    },
    contracts: [VendingMachine],
    events: {
      SimpleStorage: ["Buy", "Restock", "Withdraw", "Remove"],
    },
  };

export default options;