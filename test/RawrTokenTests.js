const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('RAWR Token Contract', () => {
    var rawrToken;
    var deployerAddress, minterAddress, burnerAddress, playerAddress, player2Address;

    before(async () => {
        [deployerAddress, minterAddress, burnerAddress, playerAddress, player2Address] = await ethers.getSigners();
        RawrToken = await ethers.getContractFactory("RawrToken");
    });

    beforeEach(async () => {
        rawrToken = await RawrToken.deploy("Rawrshak Governance Token", "RAWR", web3.utils.toWei('100000000', 'ether'));
    });

    describe("Basic Tests", () => {
        it('Check if correct amount of tokens was minted', async () => {
            // check balance of deployer address
            balance = await rawrToken.balanceOf(deployerAddress.address);
            expect(balance).to.equal(web3.utils.toWei('100000000', 'ether'));
        });
    });

    describe("Token transactions", () => {
        it('Transfer balance from deployer wallet to player wallet', async () => {
            // transfer tokens
            await rawrToken.transfer(playerAddress.address, web3.utils.toWei('5000', 'ether'));
    
            // check balances
            expect(await rawrToken.balanceOf(deployerAddress.address)).to.equal(web3.utils.toWei('99995000', 'ether'));
            expect(await rawrToken.balanceOf(playerAddress.address)).to.equal(web3.utils.toWei('5000', 'ether'));
        });

        it('Player Transaction Approval', async () => {
            // transfer tokens
            await rawrToken.transfer(playerAddress.address, web3.utils.toWei('5000', 'ether'));

            await rawrToken.connect(playerAddress).approve(player2Address.address, web3.utils.toWei('2500', 'ether'));
            await rawrToken.connect(player2Address).transferFrom(playerAddress.address, player2Address.address, web3.utils.toWei('2500', 'ether'));
    
            // check balances
            expect(await rawrToken.balanceOf(deployerAddress.address)).to.equal(web3.utils.toWei('99995000', 'ether'));
            expect(await rawrToken.balanceOf(playerAddress.address)).to.equal(web3.utils.toWei('2500', 'ether'));
            expect(await rawrToken.balanceOf(player2Address.address)).to.equal(web3.utils.toWei('2500', 'ether'));
        });
    });
});
