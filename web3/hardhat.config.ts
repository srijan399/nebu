import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL_ETH, RPC_URL_BASE, RPC_URL_AMOY, PRIVATE_KEY, ETHERSCAN_API } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: RPC_URL_ETH || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    amoy : {
      url: RPC_URL_AMOY || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: RPC_URL_BASE || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      'base-sepolia': `${ETHERSCAN_API}`,
      'polygonAmoy': `${ETHERSCAN_API}`,
      'sepolia': `${ETHERSCAN_API}`,
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com"
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  }
};

export default config;
