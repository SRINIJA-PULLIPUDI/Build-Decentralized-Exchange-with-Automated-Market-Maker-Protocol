const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DEX", function () {
  let dex, tokenA, tokenB, owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    tokenA = await MockERC20.deploy("Token A", "TKA");
    tokenB = await MockERC20.deploy("Token B", "TKB");

    const DEX = await ethers.getContractFactory("DEX");
    dex = await DEX.deploy(tokenA.address, tokenB.address);

    await tokenA.approve(dex.address, ethers.constants.MaxUint256);
    await tokenB.approve(dex.address, ethers.constants.MaxUint256);
  });

  it("should allow initial liquidity provision", async function () {
    await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
    const reserves = await dex.getReserves();
    expect(reserves[0]).to.equal(ethers.utils.parseEther("100"));
    expect(reserves[1]).to.equal(ethers.utils.parseEther("200"));
  });
});
