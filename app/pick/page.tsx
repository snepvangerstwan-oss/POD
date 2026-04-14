"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

type FrontendPod = {
  id: string;
  name: string;
  status: string;
  ledLights: string;
  accessCode: string | null;
  minutesRemaining: number;
};

export default function PickPage() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [pod, setPod] = useState<FrontendPod | null>(null);
  const [loading, setLoading] = useState(true);

  const onUpdate = useCallback(
    ({ x, y, scale }: { x: number; y: number; scale: number }) => {
      if (imgRef.current) {
        const value = make3dTransformValue({ x, y, scale });
        imgRef.current.style.setProperty("transform", value);
      }
    },
    []
  );

  async function fetchPod() {
    try {
      const res = await fetch("/api/hardware", {
        cache: "no-store",
      });

      const data = await res.json();
      console.log("Fetched pod for map:", data);
      setPod(data);
    } catch (error) {
      console.error("Failed to fetch pod:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPod();

    const interval = setInterval(() => {
      fetchPod();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function getPodColor() {
    if (pod?.ledLights === "Green") return "bg-[#32CD32]";
    if (pod?.ledLights === "Yellow") return "bg-yellow-400";
    if (pod?.ledLights === "Red") return "bg-[#FF4D4D]";
    return "bg-gray-400";
  }

  function getPodHref() {
  if (!pod) return "#";

  if (pod.status === "Available") return "/green";
  return "/red";
}

  function getStatusText() {
    if (loading) return "Loading pod status...";
    if (!pod) return "Pod status unavailable";

    if (pod.status === "Available") return "Vacant";
    if (pod.status === "Reserved") return `Reserved • ${pod.minutesRemaining} min left`;
    if (pod.status === "Occupied") return `Occupied • ${pod.minutesRemaining} min left`;
    if (pod.status === "Leaving") return `Leaving • ${pod.minutesRemaining} min left`;

    return pod.status;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <div className="bg-[#F9D9A5] px-20 py-4 rounded-xl mb-8 shadow-sm">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold">
          Pick a Pod
        </h1>
      </div>

      <div className="w-full max-w-2xl border border-gray-300 rounded-3xl overflow-hidden shadow-lg mb-4 bg-gray-50">
        <QuickPinchZoom
          onUpdate={onUpdate}
          wheelScaleFactor={500}
          draggableUnZoomed={false}
        >
          <div ref={imgRef} className="relative w-full h-full origin-top-left">
            <Image
              src="/mainmap.png"
              alt="Main Map"
              width={800}
              height={600}
              className="object-contain pointer-events-none"
              priority
            />
     
            {/* one real pod only */}
            <Link
              href={getPodHref()}
              className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md z-20 hover:scale-150 transition-transform cursor-pointer active:scale-110 ${getPodColor()}`}
              style={{ top: "55.5%", left: "51.3%" }}
              aria-label="Go to Pod Calm"
            >
              <span className="sr-only">Go to Pod Calm</span>
            </Link>
          </div>
        </QuickPinchZoom>
      </div>

      <p className="text-gray-600 font-medium mb-6 text-center">
        Use mouse wheel or pinch to zoom. Click on the pod.
      </p>

      <div className="mb-10 text-center">
        <p className="text-[#00334E] font-bold text-xl">{getStatusText()}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-6 w-full max-w-xs items-start pl-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-6 bg-[#32CD32] rounded-md border border-black/20 shadow-inner"></div>
          <span className="text-[#00334E] font-bold text-xl">= Available</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-6 bg-yellow-400 rounded-md border border-black/20 shadow-inner"></div>
          <span className="text-[#00334E] font-bold text-xl">= Reserved</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-6 bg-[#FF4D4D] rounded-md border border-black/20 shadow-inner"></div>
          <span className="text-[#00334E] font-bold text-xl">= Occupied</span>
        </div>
      </div>

      <footer className="mt-auto pt-10 pb-6">
        <Image
          src="/logo.png"
          alt="Parent Pod Logo"
          width={110}
          height={70}
          className="object-contain"
          style={{ width: "auto", height: "auto" }}
        />
      </footer>
    </main>
  );
}