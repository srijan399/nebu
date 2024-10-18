"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
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
import { TiPlus } from "react-icons/ti";

const contractABI = abi;
const contractAddress = "0x07bCD56CE70C891B1c019d36A404F4B681359802";

const formSchema = z.object({
  description: z.string().min(5).max(200), // A string with a minimum length of 5 and a maximum length of 200
  imageUrl: z.string().url({ message: "Must be a valid URL" }), // A string that must be a valid URL
  name: z.string().min(2).max(50), // A string with a minimum length of 2 and a maximum length of 50
  goal: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
    .transform((val) => Number(val)),
});

const AddCampaign = () => {
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
      description: "",
      imageUrl: "",
      name: "",
      goal: 1,
    },
  });

  const { status, writeContractAsync, error } = useWriteContract();
  const account = useAccount();
  const desc = 1000000000000000;
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setTransactionStatus("Submitting...");
    setTransactionHash(undefined);

    try {
      // Call the smart contract function with form data using writeContractAsync
      const tx = await writeContractAsync(
        {
          address: contractAddress,
          abi: contractABI,
          functionName: "createCampaign",
          args: [
            data.name,
            Number(data.goal),
            desc,
            data.description,
            data.imageUrl,
            account?.address,
          ], // Pass form data
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

  if (!isMounted) return null;

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button className="text-primary-foreground border-primary-foreground">
            <TiPlus className="mr-1 ml-0" />
            Make a Campaign
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter campaign description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your goal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default AddCampaign;
