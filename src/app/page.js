"use client"
import Map from "@/components/map/Map";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center">
      <Sidebar />
      <Map />
    </div>
  );
}
