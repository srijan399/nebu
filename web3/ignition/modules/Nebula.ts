import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for the contract
  const Nebula = await ethers.deployContract("Nebula");

  console.log("Deploying Nebula...");

  // Wait for the deployment to complete
  await Nebula.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await Nebula.getAddress();
  console.log("Nebula deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
