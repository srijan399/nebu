"use client";

import { ModeToggle } from "@/components/theme/theme-switcher";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BackgroundLines } from "@/components/ui/background-lines";

function YourApp() {
  return (
    <>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-background">
        <ModeToggle />
        <ConnectButton
          label="Sign in"
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </BackgroundLines>
    </>
  );
}

export default YourApp;
