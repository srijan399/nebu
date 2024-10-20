import React from "react";
import { Progress } from "@/components/ui/progress"; // Import the Progress component from shadcn

interface ProgressProps {
  raised: number;
  goal: number;
}

export function ProgressDemo({ raised, goal }: ProgressProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Calculate the progress percentage based on raised and goal
    const percentage = (raised / goal) * 100;

    // Simulate loading or update the progress dynamically
    const timer = setTimeout(() => {
      setProgress(percentage); // Set the progress to the calculated percentage
    }, 500); // Simulate a delay

    return () => clearTimeout(timer); // Clean up the timer
  }, [raised, goal]);

  return (
    <div className="w-full">
      <p className="font-fredoka mb-2 font-bold text-sm">
        Raised: {raised / 10 ** 18} / {goal / 10 ** 18} POL
      </p>
      <Progress value={progress} className="w-[95%]" />
      {/* Adjust the width as needed */}
      {/* <p>{progress.toFixed(2)}%</p> Display the progress percentage */}
    </div>
  );
}
