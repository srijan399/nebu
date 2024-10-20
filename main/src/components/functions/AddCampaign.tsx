"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import abi from "app/abi";
import { useAccount, useWriteContract } from "wagmi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TiPlus } from "react-icons/ti";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const contractABI = abi;
const contractAddress = "0x64801c4e53b942Ff5d5eef0b77f4FA5024b03D56";

const formSchema = z.object({
  description: z.string().min(5).max(200),
  imageUrl: z.string().url({ message: "Must be a valid URL" }),
  name: z.string().min(2).max(50),
  deadline: z
    .date()
    .refine((date) => date.getTime() > Date.now(), {
      message: "Deadline must be a future date",
    })
    .transform((val) => val.getTime() / 1000),
  goal: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "Must be greater than 0" }),
});

const AddCampaign = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [transactionHash, setTransactionHash] = useState<string | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false); // State to handle dialog visibility

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      imageUrl: "",
      name: "",
      deadline: new Date().getTime() / 1000,
      goal: 0,
    },
  });

  const { status, writeContractAsync, error } = useWriteContract();
  const account = useAccount();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    setTransactionStatus("Submitting...");
    setTransactionHash(undefined);

    try {
      const tx = await writeContractAsync(
        {
          address: contractAddress,
          abi: contractABI,
          functionName: "createCampaign",
          args: [
            data.name,
            Number(data.goal * 10 ** 18),
            data.deadline,
            data.description,
            data.imageUrl,
            account?.address,
          ],
        },
        {
          onSuccess(data: any) {
            console.log("Transaction successful!", data);
            setTransactionStatus("Transaction submitted!");
            setTransactionHash(data?.hash); // Display the transaction hash
          },
          onSettled(data: any, error: any) {
            if (error) {
              setTransactionStatus("Transaction failed.");
              console.error("Error on settlement:", error);
            } else {
              console.log("Transaction settled:", data);
              setTransactionStatus("Transaction confirmed!");
              setTransactionHash(data?.hash);

              // Close the dialog and reset the form
              setOpen(false);
              form.reset({
                description: "",
                imageUrl: "",
                name: "",
                deadline: new Date().getTime() / 1000,
                goal: 0,
              });

              // Reset any form input sizes if necessary
            }
          },
          onError(error: any) {
            console.error("Transaction error:", error);
            setTransactionStatus("Transaction failed. Please try again.");
          },
        }
      );
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setTransactionStatus("Transaction failed. Please try again.");
    }
  }

  if (!isMounted) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="text-primary-foreground border-primary-foreground">
            <TiPlus className="mr-1 ml-0" />
            Make a Campaign
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Campaign Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your goal (in ETH)"
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
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50">
                            <Calendar
                              mode="single"
                              selected={new Date(field.value)}
                              onSelect={field.onChange} // Update form state directly
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </div>
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCampaign;
