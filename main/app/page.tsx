"use client";

import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useEnsName, useAccount } from "wagmi";
import Navbar from "@/components/functions/Navbar";

function Landing() {
  const account = useAccount(); // Fetch connected address
  const address = account?.address; // Extract address from account object
  const { data: ensName } = useEnsName({ address }); // Fetch ENS name if it exists
  console.log(ensName);
  if (address) {
    console.log(address);
  }

  return (
    <>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        {/* Theme switcher and connect button in the top-right corner */}
        <Navbar />
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          Nebula <br />
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-10">
          Redefining crowdfunding: Empowering communities through transparent,
          decentralized impact-driven investments.
        </p>

        {/* Main content centered */}
      </BackgroundLines>
    </>
  );
}

export default Landing;
