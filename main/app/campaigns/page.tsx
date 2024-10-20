"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/functions/Navbar";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  useDisconnect,
  useAccount,
  useReadContract,
  useWriteContract,
  useBalance,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProgressDemo } from "@/components/functions/ProgressBar";

interface Campaign {
  name: string;
  description: string;
  goal: number;
  deadline: number;
  raised: number;
  image: string;
  funders: { funder: string; amount: number }[];
}

const contractABI = abi;
const contractAddress = "0x761eeF428035541f64EcB883bF3C067e8F398b84";

function SidebarDemo() {
  const account = useAccount();
  // const [hovering, setHovering] = useState(false);
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // Added state for active tab
  const router = useRouter(); // Initialize useRouter
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [myCampaigns, setMyCampaigns] = useState([]);

  const { data, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getCampaigns",
  });

  useEffect(() => {
    console.log("Setting up refetch interval");

    const interval = setInterval(() => {
      refetch()
        .then((result: any) => {
          console.log("Data refetched: ", result);
        })
        .catch((error: any) => {
          console.error("Error during refetch: ", error);
        });
    }, 5000);
    return () => {
      console.log("Clearing refetch interval");
      clearInterval(interval);
    };
  }, [refetch]);

  // console.log(data);

  const myData = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getMyCampaigns",
    args: [account?.address],
  });

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
        "h-[88vh] overflow-y-auto"
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
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full relative overflow-y-auto">
        {activeTab === "dashboard" && <Dashboard camps={campaigns} />}
        {activeTab === "my-campaigns" && <MyCampaigns data={myData.data} />}
      </div>
    </div>
  );
}

function Dashboard(props: { camps: Campaign[] }) {
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
            <ThreeDCardDemo camp={campaign} idx={index} />
          ))
        ) : (
          <p>No campaigns available.</p>
        )}
      </div>
    </div>
  );
}

function MyCampaigns(props: { data: Campaign[] }) {
  console.log("props:", props.data);
  const myCamps = props.data;
  return (
    <div>
      <h2 className="text-2xl font-bold">My Campaigns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {myCamps.length > 0 ? (
          myCamps.map((camp, index) => (
            <div className="w-96 relative rounded-3xl overflow-hidden max-w-full bg-gradient-to-r from-[#1D2235] to-[#121318] my-10">
              <div className="relative z-10">
                <Lens hovering={false}>
                  <Image
                    src={camp.image}
                    alt={camp.name}
                    width={350}
                    height={350}
                    className="rounded-2xl w-full h-auto"
                  />
                </Lens>
                <motion.div className="py-4 relative z-20 px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 md:pt-8">
                  <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-left">
                    {camp.name}
                  </h2>
                  <p className="text-neutral-200 text-left my-4 text-sm sm:text-base md:text-base font-fredoka">
                    {camp.description}
                  </p>
                  <button className="shadow-[0_0_0_3px_#000000_inset] px-2 w-32 text-base py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mt-2 disabled">
                    Goal: {Number(camp.goal)} POL
                  </button>
                </motion.div>
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

export function ThreeDCardDemo(props: { camp: Campaign; idx: number }) {
  const { camp, idx } = props;

  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [raised, setRaised] = useState<number>(0); // State to store raised amount
  const [fund, setFund] = useState<string>(""); // State to store fund input as a string
  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract();
  const { data: campaign, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "campaigns",
    args: [idx],
  });

  // Update the raised amount when campaign data is loaded
  useEffect(() => {
    if (campaign) {
      const newRaisedAmount = Number(campaign[4]); // Adjust index if necessary
      console.log("Updated raised amount:", newRaisedAmount);
      setRaised(newRaisedAmount);
    }
  }, [campaign]);

  async function handleFund() {
    if (address && Number(fund) > 0) {
      try {
        console.log("Funding campaign...");
        console.log("Index: ", idx);
        console.log("Funding amount: ", fund);

        const tx = await writeContractAsync({
          address: contractAddress,
          abi: contractABI,
          functionName: "fundCampaign",
          args: [idx],
          value: BigInt(Number(fund) * 10 ** 18),
        });

        const {
          isSuccess,
          isError,
          data: receipt,
        } = await useWaitForTransactionReceipt({
          hash: tx.hash,
        });

        if (isSuccess) {
          console.log("Transaction successful:", receipt);
          // Refetch campaign data after funding
          await refetch();
        } else if (isError) {
          console.error("Transaction failed");
        }
      } catch (error) {
        console.error("Error funding campaign:", error);
      }
    } else {
      console.error("Fund amount must be greater than 0");
    }
  }

  return (
    <CardContainer
      className="inter-var w-[60vh]"
      containerClassName="w-[60vh] py-4"
    >
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white font-fredoka"
        >
          {camp.name}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 font-fredoka"
        >
          {camp.description}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-white-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {/* <button className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] "></button> */}
          <button className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mt-2 disabled">
            Goal: {Number(camp.goal)} POL
          </button>
        </CardItem>
        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={-10}
          className="w-full mt-4"
        >
          <Image
            src={camp.image}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-10">
          <CardItem
            translateZ={20}
            translateX={-40}
            as="button"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            <ProgressDemo raised={raised} goal={Number(camp.goal)} />
          </CardItem>
          <CardItem
            translateZ={20}
            translateX={40}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            onClick={() => setOpen(true)}
          >
            Fund
          </CardItem>
        </div>
      </CardBody>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-68">
          <Input
            placeholder="Enter amount in POL"
            type="number"
            value={fund}
            onChange={(e) => setFund(e.target.value)} // Update fund value
            style={{
              appearance: "none", // Remove spinner arrows
            }}
            className="w-52 mt-4"
          />
          <button
            className="px-8 py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500"
            onClick={() => {
              handleFund();
              setOpen(false); // Close the dialog here
            }}
          >
            Fund
          </button>
        </DialogContent>
      </Dialog>
    </CardContainer>
  );
}
