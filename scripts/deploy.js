const hre = require("hardhat");

async function main() {
  const [Owner,user2,user3,user4] = await ethers.getSigners();

  // const DropCollection = await hre.ethers.getContractFactory("DropCollection");
  // const dropCollection = await DropCollection.deploy("Name","Symbol","0x5daCcC5653C7D640EbB2a1EdAeB91305842a8125","0x5daCcC5653C7D640EbB2a1EdAeB91305842a8125",3);
  // await dropCollection.deployed(); 
  const DropKitPass = await hre.ethers.getContractFactory("DropKitPass");
  const dropKitPass = await DropKitPass.deploy();
  await dropKitPass.deployed(); 
  console.log(`DropKitPass contracts deployed to ${dropKitPass.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
