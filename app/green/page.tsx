"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";
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

export default function CalmPodPage() {
  const imgRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<any>(null);

  const [pod, setPod] = useState<FrontendPod | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchPod() {
    try {
      const res = await fetch("/api/hardware", {
        cache: "no-store",
      });

      const data = await res.json();
      console.log("Fetched pod:", data);
      setPod(data);
    } catch (error) {
      console.error("Error fetching pod:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUsePod() {
    try {
      const res = await fetch("/api/hardware", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podId: "pod-1",
          event: "reserve_pod",
        }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      await fetchPod();
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  }

  useEffect(() => {
    fetchPod();

    const interval = setInterval(() => {
      fetchPod();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // scale map
  useEffect(() => {
    const zoomToTarget = () => {
      if (pinchRef.current) {
        pinchRef.current.scaleTo({
          x: 300,
          y: 300,
          scale: 3,
          animated: false,
        });
      }
    };

    const timer = setTimeout(zoomToTarget, 100);
    return () => clearTimeout(timer);
  }, []);

  const onUpdate = useCallback(
    ({ x, y, scale }: { x: number; y: number; scale: number }) => {
      if (imgRef.current) {
        const value = make3dTransformValue({ x, y, scale });
        imgRef.current.style.setProperty("transform", value);
      }
    },
    []
  );

  function getPodColor() {
    if (pod?.ledLights === "Green") return "bg-[#32CD32]";
    if (pod?.ledLights === "Yellow") return "bg-yellow-400";
    if (pod?.ledLights === "Red") return "bg-red-500";
    return "bg-[#DEDEDE]";
  }

  function getStatusBoxStyle() {
    if (pod?.ledLights === "Green") {
      return {
        box: "bg-[#E0EEDA] text-[#32CD32]",
        dot: "bg-[#32CD32]",
      };
    }

    if (pod?.ledLights === "Yellow") {
      return {
        box: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-400",
      };
    }

    if (pod?.ledLights === "Red") {
      return {
        box: "bg-red-100 text-red-600",
        dot: "bg-red-500",
      };
    }

    return {
      box: "bg-gray-100 text-gray-500",
      dot: "bg-gray-400",
    };
  }

  function getStatusText() {
    if (loading) return "Loading...";
    if (!pod) return "Pod unavailable";

    if (pod.status === "Available") return "Available now";
    if (pod.status === "Reserved") return `Reserved • ${pod.minutesRemaining} min left`;
    if (pod.status === "Occupied") return `Occupied • ${pod.minutesRemaining} min left`;
    if (pod.status === "Leaving") return `Leaving • ${pod.minutesRemaining} min left`;

    return pod.status;
  }

  function getDescriptionText() {
    if (!pod) {
      return "We could not load the current pod status.";
    }

    if (pod.status === "Available") {
      return "The pod is ready for you, use it now and you'll have 2 hours of quiet, private space.";
    }

    if (pod.status === "Reserved") {
      return "This pod has just been reserved and is temporarily being held.";
    }

    if (pod.status === "Occupied") {
      return "This pod is currently in use. Please check again later.";
    }

    if (pod.status === "Leaving") {
      return "This pod is in its leaving period and should be available again soon.";
    }

    return "Current pod status loaded from the backend.";
  }

  const statusStyle = getStatusBoxStyle();

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <div className="bg-[#F9D9A5] px-16 py-4 rounded-xl mb-10 shadow-sm text-center">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          Pod Calm
        </h1>
      </div>

      {/* map box */}
      <div className="relative w-full max-w-lg border border-gray-300 rounded-3xl overflow-hidden shadow-lg mb-10 bg-gray-50 aspect-[4/3]">
        <QuickPinchZoom
          ref={pinchRef}
          onUpdate={onUpdate}
          wheelScaleFactor={500}
          draggableUnZoomed={true}
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

            {/* other pods */}
            <div
              className="absolute w-5 h-5 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm"
              style={{ top: "55.5%", left: "45.2%" }}
            />
            <div
              className={`absolute w-5 h-5 rounded-lg border-4 border-white shadow-xl scale-110 z-10 ${getPodColor()}`}
              style={{ top: "55.5%", left: "51.3%" }}
            />
            <div
              className="absolute w-5 h-5 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm"
              style={{ top: "67.5%", left: "60.8%" }}
            />
            <div
              className="absolute w-5 h-5 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm"
              style={{ top: "60.3%", left: "60.8%" }}
            />
          </div>
        </QuickPinchZoom>
      </div>

      {/* info section */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 mb-10">
        <div
          className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 ${statusStyle.box}`}
        >
          <div className={`w-4 h-4 rounded-full ${statusStyle.dot}`} />
          <span className="font-bold text-lg">{getStatusText()}</span>
        </div>

        <p className="text-sm text-center text-gray-500 leading-relaxed px-4">
          {getDescriptionText()}
        </p>

        {pod?.accessCode && (
          <div className="bg-gray-100 rounded-xl px-4 py-3 text-center w-full">
            <p className="text-sm text-gray-500">Access code</p>
            <p className="text-2xl font-bold text-[#4A4A4A]">{pod.accessCode}</p>
          </div>
        )}
      </div>

      <div className="flex gap-6 mb-12">
        <Link href="/pick">
          <button className="bg-[#F9D9A5] text-[#4A4A4A] font-bold py-3 px-10 rounded-xl shadow hover:bg-[#e7c997] transition-colors">
            Go back
          </button>
        </Link>
        <Link href="/reserve">
        <button
          onClick={handleUsePod}
          disabled={pod?.status !== "Available"}
          className={`font-bold py-3 px-10 rounded-xl shadow transition-colors ${
            pod?.status === "Available"
              ? "bg-[#F9B233] text-[#4A4A4A] hover:bg-[#e5a32e]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Use Pod
        </button>
        </Link>
      </div>

      <footer className="mt-auto pt-10 pb-6 text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={110}
          height={70}
          className="object-contain inline-block"
        />
      </footer>
    </main>
  );
}