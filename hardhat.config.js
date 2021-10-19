require("@nomiclabs/hardhat-waffle");
require('@typechain/hardhat');
require('@nomiclabs/hardhat-ethers');

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
      gasPrice: 0,
      ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
    },
    optimism_kovan: {
      chainId: 69,
      url: 'https://kovan.optimism.io',
      accounts: [process.env.KOVAN_PRIVATE_KEY],
      gasPrice: 15000000,
      ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
    }
  },
  solidity: "0.8.3",
};
