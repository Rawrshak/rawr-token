const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('L2 Native Rawrshak ERC20 Contract Tests', () => {
    var l2Token;
    var deployerAddress, minterAddress, burnerAddress, playerAddress, player2Address;
    var l2Bridge = "0x50EB44e3a68f1963278b4c74c6c343508d31704C";

    before(async () => {
        [deployerAddress, minterAddress, burnerAddress, playerAddress, player2Address] = await ethers.getSigners();
        L2NativeRawrshakERC20Token = await ethers.getContractFactory("L2NativeRawrshakERC20Token");
    });

    beforeEach(async () => {
        l2Token = await L2NativeRawrshakERC20Token.deploy(l2Bridge, "Rawrshak Governance Token", "RAWR", web3.utils.toWei('100000000', 'ether'));
    });

    describe("Basic Tests", () => {
        it('No initial supply', async () => {
            // check balance of deployer address
            l2Token = await L2NativeRawrshakERC20Token.deploy(l2Bridge, "Rawrshak Governance Token", "RAWR", 0);

            balance = await l2Token.balanceOf(deployerAddress.address);
            expect(balance).to.equal(0);
        });

        it('Check if correct amount of tokens was minted', async () => {
            // check balance of deployer address
            balance = await l2Token.balanceOf(deployerAddress.address);
            expect(balance).to.equal(web3.utils.toWei('100000000', 'ether'));
        });
        
        it('Deployer wallet must have default admin role', async () => {
            var default_admin_role = await l2Token.DEFAULT_ADMIN_ROLE();

            expect(await l2Token.hasRole(default_admin_role, deployerAddress.address)).to.equal(true);
        });

        it('L2 Bridge contract has the correct roles', async () => {
            var minter_role = await l2Token.MINTER_ROLE();
            var burner_role = await l2Token.BURNER_ROLE();

            expect(await l2Token.hasRole(minter_role, l2Bridge)).to.equal(true);
            expect(await l2Token.hasRole(burner_role, l2Bridge)).to.equal(true);
        });

        it('Deployer wallet must not minter and burner roles', async () => {
            var minter_role = await l2Token.MINTER_ROLE();
            var burner_role = await l2Token.BURNER_ROLE();

            expect(await l2Token.hasRole(minter_role, deployerAddress.address)).to.equal(false);
            expect(await l2Token.hasRole(burner_role, deployerAddress.address)).to.equal(false);
        });
        
        it('Admin grants minter wallet and burner wallet the minter and burner roles', async () => {
            var minter_role = await l2Token.MINTER_ROLE();
            var burner_role = await l2Token.BURNER_ROLE();

            // deployer address grants minter wallet a role
            await l2Token.grantRole(minter_role, minterAddress.address);
            
            // deployer address grants burner wallet a role
            await l2Token.grantRole(burner_role, burnerAddress.address);

            // check to see if minter wallet is the minter role
            expect(await l2Token.hasRole(minter_role, minterAddress.address)).to.equal(true);
            expect(await l2Token.hasRole(burner_role, burnerAddress.address)).to.equal(true);
        });
    });

    describe("Token transactions", () => {
        it('Transfer balance from deployer wallet to player wallet', async () => {
            // transfer tokens
            await l2Token.transfer(playerAddress.address, web3.utils.toWei('5000', 'ether'));
    
            // check balances
            expect(await l2Token.balanceOf(deployerAddress.address)).to.equal(web3.utils.toWei('99995000', 'ether'));
            expect(await l2Token.balanceOf(playerAddress.address)).to.equal(web3.utils.toWei('5000', 'ether'));
        });
            
        it('mint tokens', async () => {
            const newSupply = web3.utils.toWei('10000', 'ether');
            const newTotalSupply = web3.utils.toWei('100010000', 'ether');
    
            // give minter address minter role
            var minter_role = await l2Token.MINTER_ROLE();
            await l2Token.grantRole(minter_role, minterAddress.address);
    
            // mint new tokens by deployer and send to player 2
            await l2Token.connect(minterAddress).mint(player2Address.address, newSupply);
            expect(await l2Token.balanceOf(player2Address.address)).to.equal(newSupply);
            expect(await l2Token.totalSupply()).to.equal(newTotalSupply);
        });
        
        it('burn tokens', async () => {
            const burnSupply = web3.utils.toWei('10000', 'ether');
            const newTotalSupply = web3.utils.toWei('99990000', 'ether');
            
            // give burner address burner role
            var burner_role = await l2Token.BURNER_ROLE();
            await l2Token.grantRole(burner_role, burnerAddress.address);
    
            // burn new tokens by account 2
            await l2Token.connect(burnerAddress).burn(deployerAddress.address, burnSupply);
            expect(await l2Token.balanceOf(deployerAddress.address)).to.equal(newTotalSupply);
            expect(await l2Token.totalSupply()).to.equal(newTotalSupply);
        });
        
        it('Player Transaction Approval', async () => {
            // transfer tokens
            await l2Token.transfer(playerAddress.address, web3.utils.toWei('5000', 'ether'));

            await l2Token.connect(playerAddress).approve(player2Address.address, web3.utils.toWei('2500', 'ether'));
            await l2Token.connect(player2Address).transferFrom(playerAddress.address, player2Address.address, web3.utils.toWei('2500', 'ether'));
    
            // check balances
            expect(await l2Token.balanceOf(deployerAddress.address)).to.equal(web3.utils.toWei('99995000', 'ether'));
            expect(await l2Token.balanceOf(playerAddress.address)).to.equal(web3.utils.toWei('2500', 'ether'));
            expect(await l2Token.balanceOf(player2Address.address)).to.equal(web3.utils.toWei('2500', 'ether'));
        });
    });
});
