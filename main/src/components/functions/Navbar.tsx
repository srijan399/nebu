"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ModeToggle } from "../theme/theme-switcher";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-transparent backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between w-full px-12 py-4 ">
        {/* Nebula Text Aligned to Start */}
        <div className="flex justify-start">
          <Link href="/">
            <span className="font-bold text-xl font-fredoka cursor-pointer">
              Nebula
            </span>
          </Link>
        </div>

        {/* Navigation Links Centered */}

        <div className="hidden md:flex items-center justify-center gap-6 ml-24">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/campaigns">Campaigns</NavLink>
          {isConnected && (
            <NavLink href="/contribution">My Contributions</NavLink>
          )}
          <NavLink href="/about">About</NavLink>
        </div>

        {/* Connect Button and ModeToggle Aligned to End */}
        <div className="flex items-center justify-end gap-4">
          <ModeToggle />
          <ConnectButton
            label="Connect Wallet"
            accountStatus="avatar"
            chainStatus="none"
          />
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-text hover:text-primary px-3 py-2 rounded-md text-sm font-bold font-fredoka transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
