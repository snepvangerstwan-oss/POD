"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

type FrontendPod = {
  id: string;
  name: string;
  status: string;
  ledLights: string;
  accessCode: string | null;
  SessionEnd: string | null;
};

export default function UsingPodPage() {
  const router = useRouter();

  const imgRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<any>(null);

  const [pod, setPod] = useState<FrontendPod | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  // Map zooming
  useEffect(() => {
    const zoomToTarget = () => {
      if (pinchRef.current) {
        pinchRef.current.scaleTo({
          x: 350,
          y: 330,
          scale: 2.5,
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

  async function fetchPod() {
    try {
      const res = await fetch("/api/hardware", {
        cache: "no-store",
      });

      const data = await res.json();
      console.log("Fetched confirmed page pod:", data);

      setPod(data);

      if (!data) {
        router.push("/expire");
        return;
      }

      // If session is no longer active, leave this page
      if (data.status === "Available") {
        router.push("/expire");
        return;
      }

      // If somehow user ends up here while not occupied, send them away
      if (data.status !== "Occupied") {
        router.push("/expire");
        return;
      }

      if (data.SessionEnd) {
        const endMs = new Date(data.SessionEnd).getTime();
        const nowMs = Date.now();
        const diffSeconds = Math.max(
          Math.floor((endMs - nowMs) / 1000),
          0
        );

        setSecondsLeft(diffSeconds);

        if (diffSeconds <= 0) {
          router.push("/expire");
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch pod:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch immediately + poll every 5 seconds
  useEffect(() => {
    fetchPod();

    const refreshInterval = setInterval(() => {
      fetchPod();
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Local countdown every second for smooth display
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          router.push("/expire");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [secondsLeft, router]);

  function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      {/* pod name */}
      <div className="bg-[#F9D9A5] px-16 py-4 rounded-xl mb-8 shadow-sm text-center">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          {pod?.name ?? "Your Pod Session"}
        </h1>
      </div>

      {/* zoom function */}
      <div className="relative w-full max-w-lg border border-gray-300 rounded-3xl overflow-hidden shadow-lg mb-8 bg-gray-50 aspect-[4/3]">
        <QuickPinchZoom
          ref={pinchRef}
          onUpdate={onUpdate}
          wheelScaleFactor={500}
          draggableUnZoomed={true}
        >
          <div ref={imgRef} className="relative w-full h-full origin-top-left">
            <div className="relative w-full h-full">
              <Image
                src="/mainmap.png"
                alt="Main Map"
                fill
                className="object-contain pointer-events-none"
                priority
              />
            </div>

            {/* using pod color */}
            <div
              className="absolute w-6 h-6 bg-[#007BFF] rounded-lg border-4 border-white shadow-xl scale-110 z-10"
              style={{ top: "55.5%", left: "48.3%" }}
            />

            {/* other pod */}
            <div
              className="absolute w-6 h-6 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm opacity-50"
              style={{ top: "55.5%", left: "41.2%" }}
            />
            <div
              className="absolute w-6 h-6 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm opacity-50"
              style={{ top: "70.5%", left: "60.8%" }}
            />
            <div
              className="absolute w-6 h-6 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm opacity-50"
              style={{ top: "60.3%", left: "60.8%" }}
            />
          </div>
        </QuickPinchZoom>
      </div>

      {/* timer section */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-8">
        {/* blue */}
        <div className="w-full bg-[#E0F2FE] text-[#007BFF] py-4 px-6 rounded-xl flex items-center justify-center gap-3 border border-[#BAE6FD]">
          <div className="w-4 h-4 bg-[#007BFF] rounded-full" />
          <span className="font-bold text-lg">Pod is Active</span>
        </div>

        {/* timer box */}
        <div className="w-full bg-[#F9D9A5] rounded-xl p-6 shadow-sm text-center">
          <p className="text-[#4A4A4A] text-xl font-medium mb-1">Time left:</p>
          <p className="text-[#000000] text-5xl font-extrabold italic min-h-[60px]">
            {loading ? "--:--:--" : formatTime(secondsLeft)}
          </p>
        </div>

        {/* optional access code display */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Access Code</p>
          <p className="text-3xl font-black tracking-tight text-black">
            {pod?.accessCode ?? "------"}
          </p>
        </div>
      </div>

      {/* QR image */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
        <p className="text-gray-600 font-semibold text-sm">
          Scan to extend or end session:
        </p>
        <Image
          src="/QR.png"
          alt="Session QR Code"
          width={150}
          height={150}
          className="object-contain rounded-lg shadow-md"
        />
      </div>

      {/* Return button */}
      <Link href="/pick">
        <button className="bg-[#C8D3D5] text-[#4A4A4A] font-bold py-3 px-12 rounded-xl shadow-md mb-12 hover:bg-[#b8c5c7] transition-colors">
          Back to main map
        </button>
      </Link>

      {/* logo image */}
      <footer className="mt-auto pt-10 pb-6 text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={110}
          height={70}
          className="object-contain inline-block"
          style={{ width: "auto", height: "auto" }}
        />
      </footer>
    </main>
  );
}