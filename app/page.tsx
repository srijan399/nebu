import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BackgroundLines } from "@/components/ui/background-lines";

function YourApp() {
  return (
    <>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
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
