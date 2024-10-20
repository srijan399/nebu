"use client";

import { Button } from "@/components/ui/button";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import abi from "app/abi";
import { useAccount, useWriteContract, useReadContract } from "wagmi"; // Correct hook
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const contractABI = abi;
const contractAddress = "0x518Cccfff4a08886B6ccb65B6aAE83af75Bc20c6";

// Define validation schema
const formSchema = z.object({
  username: z.string().min(2).max(50),
  favenumber: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
    .transform((val) => Number(val)), // Transform string to number
});

const AddCamp = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [transactionHash, setTransactionHash] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      favenumber: 0,
    },
  });

  const { status, writeContractAsync, error } = useWriteContract();
  const account = useAccount();
  const { data } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getUserData",
    args: [`${account.address}`],
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setTransactionStatus("Submitting...");
    setTransactionHash(undefined);

    try {
      // Call the smart contract function with form data using writeContractAsync
      const tx = await writeContractAsync(
        {
          address: contractAddress,
          abi: contractABI,
          functionName: "setUserData",
          args: [data.username, Number(data.favenumber)], // Pass form data
        },
        {
          onSuccess(data) {
            console.log("Transaction successful!", data);
            // setTransactionStatus("Transaction submitted!");
            // setTransactionHash(data);
          },
          onSettled(data, error) {
            if (error) {
              setTransactionStatus("Transaction failed.");
              console.error("Error on settlement:", error);
            } else {
              console.log("Transaction settled:", data);
              setTransactionStatus("Transaction confirmed!");
              setTransactionHash(data);
            }
          },
          onError(error) {
            console.error("Transaction error:", error);
            setTransactionStatus("Transaction failed. Please try again.");
          },
        }
      );

      // Wait for the transaction to be mined/confirmed
      // const receipt = await tx.wait();
      // if (receipt.status === 1) {
      //   setTransactionStatus("Transaction confirmed!");
      // } else {
      //   setTransactionStatus("Transaction failed.");
      // }
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setTransactionStatus("Transaction failed. Please try again.");
    }
  }

  function ViewData() {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        console.log("No data found for this address.");
        return;
      } else {
        data.map((user) => {
          console.log("Name:", user.name);
          console.log("Favorite Number:", Number(user.favoriteNumber));
        });
      }
    } else {
      console.error("Unexpected data format:", data);
    }
  }

  if (!isMounted) return null;

  return (
    <>
      <button onClick={ViewData} className="m-10">
        View
      </button>
      <Popover>
        <PopoverTrigger>
          <Button className="text-primary-foreground border-primary-foreground">
            <span className="text-text font-bold font-fredoka border-primary-foreground">
              Make a Campaign
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="favenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your favorite number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={status === "pending"}>
                {status === "pending" ? "Submitting..." : "Submit"}
              </Button>
              {error && <p className="text-red-500">Error: {error.message}</p>}
            </form>
          </Form>
          {transactionStatus && (
            <div className="mt-4">
              <p>Status: {transactionStatus}</p>
              {transactionHash && (
                <p>
                  View on oklink:{" "}
                  <a
                    href={`https://www.oklink.com/amoy/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {transactionHash}
                  </a>
                </p>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddCamp;
