"use client"
import Map from "@/components/map/Map";
import Sidebar from "@/components/sidebar/Sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center">
      <Sidebar />
      <Map />
    </div>
  );
}
