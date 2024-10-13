import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL, PRIVATE_KEY, ETHERSCAN_API } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    amoy : {
      url: "https://polygon-amoy.g.alchemy.com/v2/nv5NsmwYA2TbzzPi-lRxlBE7U2SPh2WF",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: "https://base-sepolia.g.alchemy.com/v2/nv5NsmwYA2TbzzPi-lRxlBE7U2SPh2WF",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    // apiKey: "U9CTZEN3RYUF7MAMHE1DIDVGS2HK9V36U6",
    apiKey: {
      'base-sepolia': 'ETHERSCAN_API',
      'amoy': 'ETHERSCAN_API',
      'sepolia': 'ETHERSCAN_API',
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
