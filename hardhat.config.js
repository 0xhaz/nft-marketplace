require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [process.env.PRIVATE_KEY]
    }    
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

