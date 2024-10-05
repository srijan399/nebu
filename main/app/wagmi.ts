import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia, polygonAmoy } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
  return createConfig({
    chains: [mainnet, sepolia, polygonAmoy],
    connectors,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [polygonAmoy.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
