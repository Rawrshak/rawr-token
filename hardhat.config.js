require("@nomiclabs/hardhat-waffle");
require('@typechain/hardhat');
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-web3");

// Load environment variables from .env
require('dotenv').config();

// Wallet: 0x5C7c81D7c4A202e0b67f33280e0679dD71C7c300

// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      }
    },
    optimism_local: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      gasPrice: 0
    },
    optimism_kovan: {
      chainId: 69,
      url: 'https://kovan.optimism.io',
      accounts: [process.env.KOVAN_PRIVATE_KEY],
      gasPrice: 15000000
    }
  },
  solidity: "0.8.3"
};
