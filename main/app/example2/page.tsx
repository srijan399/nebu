"use client";

import { Calendar } from "@/components/ui/calendar";
import React from "react";

function page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  if (date) {
    console.log("date", date);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>
      <p>This is the settings page content.</p>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  );
}

export default page;
