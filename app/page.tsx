import { ConnectButton } from "@rainbow-me/rainbowkit";

function YourApp() {
  return (
    <ConnectButton
      label="Sign in"
      accountStatus={{
        smallScreen: "avatar",
        largeScreen: "full",
      }}
    />
  );
}

export default YourApp;
