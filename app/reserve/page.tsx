"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FrontendPod = {
  id: string;
  name: string;
  status: string;
  ledLights: string;
  accessCode: string | null;
  minutesRemaining: number;
  ReservationExpiry: string | null;
};

export default function AccessCodePage() {
  const router = useRouter();

  const [pod, setPod] = useState<FrontendPod | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);

  async function fetchPod() {
    try {
      const res = await fetch("/api/hardware", {
        cache: "no-store",
      });

      const data = await res.json();
      console.log("Fetched reserve page pod:", data);

      if (!data) {
        router.push("/expire");
        return;
      }

      setPod(data);

      if (data.status === "Occupied") {
        router.push("/confirmed");
        return;
      }

      if (data.status === "Available") {
        router.push("/expire");
        return;
      }

      if (data.status === "Reserved" && data.ReservationExpiry) {
        const expiryMs = new Date(data.ReservationExpiry).getTime();
        setExpiryTime(expiryMs);

        const diffSeconds = Math.max(
          Math.floor((expiryMs - Date.now()) / 1000),
          0
        );
        setSecondsLeft(diffSeconds);
      } else {
        setExpiryTime(null);
        setSecondsLeft(0);
      }
    } catch (error) {
      console.error("Failed to fetch pod:", error);
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation() {
    try {
      const res = await fetch("/api/hardware", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podId: "pod-1",
          event: "cancel_reservation",
        }),
      });

      const data = await res.json();
      console.log("Cancel reservation response:", data);

      router.push("/expire");
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  }

  useEffect(() => {
    fetchPod();

    const refreshInterval = setInterval(() => {
      fetchPod();
    }, 2000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (!expiryTime) return;

    const timer = setInterval(() => {
      const diffSeconds = Math.max(
        Math.floor((expiryTime - Date.now()) / 1000),
        0
      );

      setSecondsLeft(diffSeconds);

      if (diffSeconds <= 0) {
        router.push("/expire");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime, router]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function getPodColor() {
    if (pod?.ledLights === "Green") return "bg-[#32CD32]";
    if (pod?.ledLights === "Yellow") return "bg-yellow-400";
    if (pod?.ledLights === "Red") return "bg-[#FF4D4D]";
    return "bg-[#DEDEDE]";
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-4 px-4 overflow-hidden">
      <div className="bg-[#F9D9A5] px-12 py-3 rounded-xl mb-4 shadow-sm text-center">
        <h1 className="text-3xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          {pod?.name ?? "Pod Calm"}
        </h1>
      </div>

      <div className="relative w-full max-w-lg h-64 border border-gray-300 rounded-3xl overflow-hidden shadow-md mb-4 opacity-75">
        <Image
          src="/small_map.png"
          alt="Small Map"
          fill
          className="object-cover object-top"
        />

        <div className="absolute top-3 left-3 bg-[#DEDEDE] border border-gray-400 px-3 py-1 rounded-md shadow-sm z-20">
          <p className="text-[10px] font-bold text-gray-700 leading-tight">
            7th floor,
            <br />
            Building K
          </p>
        </div>

        <div
          className="absolute w-9 h-9 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm"
          style={{ top: "32%", left: "25%" }}
        />
        <div
          className={`absolute w-9 h-9 rounded-lg border-4 border-white shadow-lg z-10 ${getPodColor()}`}
          style={{ top: "32%", left: "38%" }}
        />
        <div
          className="absolute w-9 h-9 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm"
          style={{ top: "52%", left: "65%" }}
        />
        <div
          className="absolute w-9 h-9 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm"
          style={{ top: "75%", left: "65%" }}
        />
      </div>

      <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-[2.5rem] p-5 shadow-2xl flex flex-col items-center gap-3 mb-4">
        <div className="absolute top-5 left-6 opacity-80">
          <Image src="/logo.png" alt="Logo" width={50} height={30} />
        </div>

        <div className="w-14 h-14 rounded-full border-[3px] border-[#32CD32] flex items-center justify-center mt-1">
          <div className="w-10 h-10 rounded-full border-2 border-[#32CD32]/20" />
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-black">Access Code</h2>
          <p className="text-[11px] text-gray-500">
            Use this code to enter the pod
          </p>
        </div>

        <div className="w-full bg-[#C8D3D5] text-black text-5xl font-black py-4 rounded-2xl text-center tracking-tighter shadow-inner">
          {loading ? "......" : pod?.accessCode ?? "------"}
        </div>

        <div className="text-center">
          <p className="text-[#FF4D4D] text-sm font-semibold">
            Expires in:{" "}
            <span className="text-xl font-bold tabular-nums">
              {formatTime(secondsLeft)}
            </span>
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-2">
          <button
            onClick={cancelReservation}
            className="w-full bg-[#F9D9A5] text-[#4A4A4A] font-bold py-2 rounded-xl text-sm shadow hover:bg-[#e7c997] transition-colors"
          >
            Cancel Reservation
          </button>

          <p className="text-[9px] text-gray-400 leading-tight px-6 text-center">
            Take your time, you have 15 minutes to enter the pod and start the
            session
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm bg-[#F9D9A5] text-[#4A4A4A] text-[10px] font-bold py-2.5 px-4 rounded-xl text-center shadow-sm">
        Once in the pod please press the button to start and end your session
      </div>
    </main>
  );
}
