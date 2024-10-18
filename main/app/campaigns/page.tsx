"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/functions/Navbar";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDisconnect, useAccount, useReadContract } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TiPlus } from "react-icons/ti";
import { IoMdWallet } from "react-icons/io";
import { Lens } from "@/components/ui/lens";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import AddCampaign from "@/components/functions/AddCampaign";
import abi from "app/abi";

function SidebarDemo() {
  const account = useAccount();
  // const [hovering, setHovering] = useState(false);
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // Added state for active tab
  const router = useRouter(); // Initialize useRouter
  const contractABI = abi;
  const contractAddress = "0x07bCD56CE70C891B1c019d36A404F4B681359802";

  const [campaigns, setCampaigns] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);

  const { data } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getCampaigns",
  });

  // console.log(data);

  const myData = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getMyCampaigns",
    args: [account?.address],
  });

  // console.log("Mydata:", myData);

  useEffect(() => {
    // Log active tab for debugging purposes
    console.log(`Active tab changed to: ${activeTab}`);
    if (activeTab === "back") {
      disconnect(); // Disconnect the user
      router.push("/"); // Navigate to the root route
    } else if (activeTab === "dashboard") {
      ViewData(); // Call the ViewData function
    } else if (activeTab === "my-campaigns") {
      ViewMyData(); // Call the ViewMyData function
    }
  }, [myData.data, data, activeTab, router, disconnect]);

  function ViewData() {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        console.log("No data found for this address.");
        return;
      } else {
        console.log("Data found for this address.");
        setCampaigns(data);
      }
    }
  }

  function ViewMyData() {
    if (Array.isArray(myData.data)) {
      if (myData.data.length === 0) {
        console.log("No data found for this address.");
        return;
      } else {
        console.log("Data found for this address.");
        setCampaigns(myData.data);
      }
    }
  }

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
    },
  ];

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
                label: `${
                  account?.address
                    ? `${account?.address.slice(
                        0,
                        7
                      )}...${account?.address.slice(-5)}`
                    : "Wallet not connected"
                }`,
                href: "",
                icon: (
                  <IoMdWallet className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Conditionally render content based on activeTab */}
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full relative">
        {activeTab === "dashboard" && <Dashboard camps={campaigns} />}
        {activeTab === "my-campaigns" && <MyCampaigns data={myData.data} />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
}

function Dashboard(props) {
  const campaigns = props.camps;
  console.log(campaigns);

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <AddCampaign />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {campaigns.length > 0 ? (
          campaigns.map((campaign, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md"
            >
              <div className="p-4">
                <p>{index}</p>
                <h2 className="text-lg font-bold">{campaign.name}</h2>
                <p className="text-sm text-neutral-500">
                  {campaign.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No campaigns available.</p>
        )}
      </div>
    </div>
  );
}

function MyCampaigns(props) {
  console.log("props:", props.data);
  const myCamps = props.data;
  return (
    <div>
      <h2 className="text-2xl font-bold">My Campaigns</h2>
      {myCamps.map((camp, index) => (
        <div className="w-96 relative rounded-3xl overflow-hidden max-w-full bg-gradient-to-r from-[#1D2235] to-[#121318] my-10">
          <div className="relative z-10">
            <Lens hovering={false}>
              <Image
                src="https://images.unsplash.com/photo-1713869820987-519844949a8a?q=80&w=3500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="image"
                width={500}
                height={500}
                className="rounded-2xl w-full h-auto"
              />
            </Lens>
            <motion.div className="py-4 relative z-20 px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 md:pt-8">
              <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-left">
                {camp.name}
              </h2>
              <p className="text-neutral-200 text-left mt-4 text-sm sm:text-base md:text-base">
                {camp.description}
              </p>
              <p className="text-neutral-200 text-left mt-4 text-sm sm:text-base md:text-base">
                {camp.goal}
              </p>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
