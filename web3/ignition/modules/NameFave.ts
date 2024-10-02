import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for the contract
  const NameFave = await ethers.deployContract("NameAndFavoriteNumber");

  console.log("Deploying NameAndFavoriteNumber...");

  // Wait for the deployment to complete
  await NameFave.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await NameFave.getAddress();
  console.log("NameAndFavoriteNumber deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
