const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const NFT = await hre.ethers.getContractFactory("NFT");

  const nftMarket = await NFTMarket.deploy();
  const nft = await NFT.deploy(nftMarket.address);

  await nftMarket.deployed()
  console.log("nftMarket deployed to:", nftMarket.address);  
  
  await nft.deployed();
  console.log("nft deployed to:", nft.address);


}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
