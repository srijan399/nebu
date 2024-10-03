import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import abi from "app/abi";
import { useAccount, useWriteContract } from "wagmi"; // Correct hook
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReadContract } from "wagmi";

const contractABI = abi;
const contractAddress = "0xd731cB6F939fB02513d904a51BF4aD745C8a520c";

// Define validation schema
const formSchema = z.object({
  username: z.string().min(2).max(50),
  favenumber: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
    .transform((val) => Number(val)), // Transform string to number
});

const AddCamp = () => {
  // Set up form handling
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      favenumber: 0,
    },
  });

  // Set up contract write hook
  const { status, writeContractAsync } = useWriteContract();
  const account = useAccount();
  const { data } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getUserData",
    args: [`${account.address}`],
  });
  // Handle form submission
  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form Data Submitted:", data);

    try {
      // Call the smart contract function with form data
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "setUserData",
        args: [data.username, Number(data.favenumber)], // Pass form data as arguments to the contract
      });
      console.log("Transaction submitted!", tx);
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  }

  function ViewData() {
    if (Array.isArray(data)) {
      console.log(data[0]);
      console.log(Number(data[1]));
    } else {
      console.error("Unexpected data format:", data);
    }
  }

  return (
    <>
      <button onClick={ViewData} className="m-10">
        view
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
              {/* {error && <p className="text-red-500">Error: {error.message}</p>} */}
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddCamp;
