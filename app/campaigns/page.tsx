"use client";
import React, { useState } from "react";
import Navbar from "@/components/functions/Navbar";
import { SidebarDemo } from "@/components/functions/SideCamp";

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
