"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), {
  ssr: false,
});

export default function Home() {
  const [addPointModal, setAddPointModal] = useState(false);
  const [showPointList, setShowPointList] = useState(false);

  return (
    <div className="w-full h-screen flex items-center">
      <Sidebar
        addPointModal={addPointModal}
        setAddPointModal={setAddPointModal}
        showPointList={showPointList}
        setShowPointList={setShowPointList}
      />
      <Map
        addPointModal={addPointModal}
        setAddPointModal={setAddPointModal}
        showPointList={showPointList}
        setShowPointList={setShowPointList}
      />
    </div>
  );
}
