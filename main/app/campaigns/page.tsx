"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/functions/Navbar";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AddCamp from "@/components/functions/AddCamp";
import { useDisconnect, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TiPlus } from "react-icons/ti";
import { IoMdWallet } from "react-icons/io";

function SidebarDemo() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // Added state for active tab
  const router = useRouter(); // Initialize useRouter

  const tabs = [
    {
      label: "Dashboard",
      id: "dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My Campaigns",
      id: "my-campaigns",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      id: "settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Log Out",
      id: "back",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    }
  ];

  useEffect(() => {
    // Log active tab for debugging purposes
    console.log(`Active tab changed to: ${activeTab}`);
    if (activeTab === "back") {
      disconnect(); // Disconnect the user
      router.push("/"); // Navigate to the root route
    }
  }, [activeTab]);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-10xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[88vh]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {tabs.map((tab) => (
                <div key={tab.id} onClick={() => setActiveTab(tab.id)}>
                  <SidebarLink
                    link={{
                      label: tab.label,
                      href: "",
                      icon: tab.icon,
                    }}
                    className={activeTab === tab.id ? "text-blue-600" : ""}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${address?.slice(0, 7)}...${address?.slice(-5)}`,
                href: "",
                icon: (
                  // <Image
                  //   src="https://assets.aceternity.com/manu.png"
                  //   className="h-7 w-7 flex-shrink-0 rounded-full"
                  //   width={50}
                  //   height={50}
                  //   alt="Avatar"
                  // />
                  <IoMdWallet className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Conditionally render content based on activeTab */}
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full relative">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "my-campaigns" && <MyCampaigns />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
}

const Dashboard = () => (
  <div>
    <div className="flex justify-between">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {/* <AddCamp /> */}
      <Button
        onClick={() => console.log("Button clicked")}
        className="pl-3"
      >
        <TiPlus className="mr-1 ml-0" />
        Add Campaign
      </Button>
    </div>
    <div className="flex justify-end">
      <AddCamp />
    </div>
  </div>
);

const MyCampaigns = () => (
  <div>
    <h2 className="text-2xl font-bold">My Campaigns</h2>
    <p>My campaigns</p>
  </div>
);

const Settings = () => (
  <div>
    <h2 className="text-2xl font-bold">Settings</h2>
    <p>This is the settings page content.</p>
  </div>
);

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        nebula
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default function Campaign() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <SidebarDemo />
      </div>
    </>
  );
}
