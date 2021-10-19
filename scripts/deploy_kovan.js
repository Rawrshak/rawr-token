// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
async function main() {
  // Instantiate the signer
  const provider = new ethers.providers.JsonRpcProvider(hre.network.config.url)
  const signer = new ethers.Wallet(process.env.KOVAN_PRIVATE_KEY, provider)

  console.log(`Main Address: ${signer.address}`);
  
  const balance = await signer.getBalance();
  console.log(`Account Balance: ${web3.utils.fromWei(balance.toString(), 'ether')}`);

  console.log("Getting RawrToken Contract");
  const RawrToken = await ethers.getContractFactory("RawrToken");

  console.log("Deploying Contract");
  const amount = process.env.TOKEN_INITIAL_AMOUNT.toString();
  const rawrToken = await RawrToken.deploy(process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL, web3.utils.toWei(amount, 'ether'));

  // Get the Rawrshak Token Address and log
  console.log("L2StandardERC20 deployed to: ", rawrToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })