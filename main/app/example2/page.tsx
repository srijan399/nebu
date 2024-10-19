"use client";

import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";


function page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // if (date) {
  //   console.log("date", date);
  // }

  const formSchema = z.object({
    description: z.string().min(5).max(200), // A string with a minimum length of 5 and a maximum length of 200
    imageUrl: z.string().url({ message: "Must be a valid URL" }), // A string that must be a valid URL
    name: z.string().min(2).max(50), // A string with a minimum length of 2 and a maximum length of 50
    deadline: z.date().refine((date) => date.getTime() > Date.now(), {
      message: "Deadline must be a future date",
    }).transform((val) => (val.getTime() / 1000)),
    goal: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
      .transform((val) => Number(val))
      .refine((val) => val > 0, { message: "Must be greater than 0" }),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      imageUrl: "",
      name: "",
      goal: 1,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    // console.log("date", data.deadline.getTime() / 1000);
    // try {
    //   // Call the smart contract function with form data using writeContractAsync
    //   const tx = await writeContractAsync(
    //     {
    //       address: contractAddress,
    //       abi: contractABI,
    //       functionName: "createCampaign",
    //       args: [
    //         data.name,
    //         Number(data.goal),
    //         desc,
    //         data.description,
    //         data.imageUrl,
    //         account?.address,
    //       ], // Pass form data
    //     },
    //     {
    //       onSuccess(data) {
    //         console.log("Transaction successful!", data);
    //         // setTransactionStatus("Transaction submitted!");
    //         // setTransactionHash(data);
    //       },
    //       onSettled(data, error) {
    //         if (error) {
    //           setTransactionStatus("Transaction failed.");
    //           console.error("Error on settlement:", error);
    //         } else {
    //           console.log("Transaction settled:", data);
    //           setTransactionStatus("Transaction confirmed!");
    //           setTransactionHash(data);
    //         }
    //       },
    //       onError(error) {
    //         console.error("Transaction error:", error);
    //         setTransactionStatus("Transaction failed. Please try again.");
    //       },
    //     }
    //   );

    //   // Wait for the transaction to be mined/confirmed
    //   // const receipt = await tx.wait();
    //   // if (receipt.status === 1) {
    //   //   setTransactionStatus("Transaction confirmed!");
    //   // } else {
    //   //   setTransactionStatus("Transaction failed.");
    //   // }
    // } catch (err) {
    //   console.error("Error submitting transaction:", err);
    //   setTransactionStatus("Transaction failed. Please try again.");
    // }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>
      <p>This is the settings page content.</p>
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
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    className="rounded-md border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default page;
