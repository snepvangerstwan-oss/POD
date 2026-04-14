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

      if (data.status === "Available") {
        router.push("/expire");
        return;
      }

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

  // Poll backend
  useEffect(() => {
    fetchPod();

    const refreshInterval = setInterval(() => {
      fetchPod();
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Smooth countdown
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

      {/* map */}
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

            {/* active pod */}
            <div
              className="absolute w-6 h-6 bg-[#007BFF] rounded-lg border-4 border-white shadow-xl scale-110 z-10"
              style={{ top: "55.5%", left: "48.3%" }}
            />
          </div>
        </QuickPinchZoom>
      </div>

      {/* status + timer */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-6">
        <div className="w-full bg-[#E0F2FE] text-[#007BFF] py-4 px-6 rounded-xl flex items-center justify-center gap-3 border border-[#BAE6FD]">
          <div className="w-4 h-4 bg-[#007BFF] rounded-full" />
          <span className="font-bold text-lg">Session in Progress</span>
        </div>

        <div className="w-full bg-[#F9D9A5] rounded-xl p-6 shadow-sm text-center">
          <p className="text-[#4A4A4A] text-xl font-medium mb-1">
            Session ends in:
          </p>
          <p className="text-[#000000] text-5xl font-extrabold italic min-h-[60px]">
            {loading ? "--:--:--" : formatTime(secondsLeft)}
          </p>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Access Code</p>
          <p className="text-3xl font-black tracking-tight text-black">
            {pod?.accessCode ?? "------"}
          </p>
        </div>
      </div>

      {/* instructions */}
      <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-inner text-center mb-6">
        <p className="text-gray-700 font-semibold text-sm leading-snug">
          Start or end your session by pressing the button inside the pod
        </p>

        <div className="text-[10px] text-gray-500 leading-relaxed mt-2">
          <p>The pod automatically detects presence.</p>
          <p>
            A <span className="font-semibold text-[#007BFF]">blue light</span>{" "}
            indicates an active session.
          </p>
          <p>If no light is visible, press the button to begin.</p>
        </div>
      </div>

      {/* usage tip */}
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center mb-8">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Please take your belongings with you when leaving the pod. The pod will
          automatically reset after your session ends.
        </p>
      </div>

      {/* back button */}
      <Link href="/pick">
        <button className="bg-[#C8D3D5] text-[#4A4A4A] font-bold py-3 px-12 rounded-xl shadow-md mb-12 hover:bg-[#b8c5c7] transition-colors">
          Back to main map
        </button>
      </Link>

      {/* logo */}
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
