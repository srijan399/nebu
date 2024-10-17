import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia, polygonAmoy, baseSepolia } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
  return createConfig({
    chains: [mainnet, sepolia, polygonAmoy, baseSepolia],
    connectors,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [polygonAmoy.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
