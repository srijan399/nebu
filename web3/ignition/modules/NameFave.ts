import { ethers } from "hardhat";

async function main() {
  // Get the account to deploy the contract
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Compile and deploy the contract
  const ContractFactory = await ethers.getContractFactory("contractName");
  const contract = await ContractFactory.deploy();

  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
