import Web3 from "web3";
import VendingMachine from "./contracts/VendingMachine.json"

const options = {
    web3: {
      block: false,
      customProvider: new Web3("ws://localhost:7545"),
    },
    contracts: [VendingMachine],
    events: {
      SimpleStorage: ["Buy", "Restock", "Withdraw", "Remove"],
    },
  };

export default options;