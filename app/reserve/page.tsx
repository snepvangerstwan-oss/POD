'use client';

import Image from "next/image";
import Link from "next/link"; 
import { useState, useEffect } from "react";

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function AccessCodePage() {
  const [accessCode, setAccessCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(900);

  useEffect(() => {
    setAccessCode(generateRandomCode());
    const timerId = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-4 px-4 overflow-hidden">
      
      {/* pod name */}
      <div className="bg-[#F9D9A5] px-12 py-3 rounded-xl mb-4 shadow-sm text-center">
        <h1 className="text-3xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          Pod Calm
        </h1>
      </div>

      {/* map */}
      <div className="relative w-full max-w-lg h-64 border border-gray-300 rounded-3xl overflow-hidden shadow-md mb-4 opacity-75">
        <Image 
          src="/small_map.png" 
          alt="Small Map" 
          fill
          className="object-cover object-top" 
        />

        {/* location*/}
        <Link href="/location" className="absolute top-3 left-3 z-30">
          <button className="bg-[#DEDEDE] border border-gray-400 px-3 py-1.5 rounded-lg shadow-sm 
                           hover:bg-[#cecece] transition-all active:scale-95 text-left">
            <p className="text-[10px] font-bold text-gray-700 leading-tight uppercase tracking-tighter">
              Location
            </p>
            <p className="text-[9px] font-semibold text-gray-500 leading-tight">
              2nd floor, Vu main building
            </p>
          </button>
        </Link>

        {/* 4 boxes */}
        <div className="absolute w-9 h-9 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm" style={{ top: '32%', left: '25%' }} />
        <div className="absolute w-9 h-9 bg-[#32CD32] rounded-lg border-4 border-white shadow-lg z-10" style={{ top: '32%', left: '38%' }} />
        <div className="absolute w-9 h-9 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm" style={{ top: '52%', left: '65%' }} />
        <div className="absolute w-9 h-9 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm" style={{ top: '75%', left: '65%' }} />
      </div>

      {/* access code card */}
      <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-[2.5rem] p-5 shadow-2xl flex flex-col items-center gap-3 mb-4">
        
        {/* logo image */}
        <div className="absolute top-5 left-6 opacity-80">
          <Image src="/logo.png" alt="Logo" width={50} height={30} />
        </div>

        {/* green circle layout */}
        <div className="w-14 h-14 rounded-full border-[3px] border-[#32CD32] flex items-center justify-center mt-1">
          <div className="w-10 h-10 rounded-full border-2 border-[#32CD32]/20" />
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-black">Access Code</h2>
          <p className="text-[11px] text-gray-500">Use this code to enter the pod</p>
        </div>

        {/* random code */}
        <div className="w-full bg-[#C8D3D5] text-black text-5xl font-black py-4 rounded-2xl text-center tracking-tighter shadow-inner">
          {accessCode || "------"}
        </div>

        {/* timer */}
        <div className="text-center">
          <p className="text-[#FF4D4D] text-sm font-semibold">
            Expires in: <span className="text-xl font-bold tabular-nums">{formatTime(secondsLeft)}</span>
          </p>
        </div>

        {/* button */}
        <div className="w-full flex flex-col items-center gap-2">
          <button className="w-full bg-[#F9D9A5] text-[#4A4A4A] font-bold py-2 rounded-xl text-sm shadow hover:bg-[#e7c997] transition-colors">
            Cancel Reservation
          </button>
          <p className="text-[9px] text-gray-400 leading-tight px-6 text-center">
            Take your time, you have 15 minutes to enter the pod and start the session
          </p>
        </div>
      </div>

      {/* context */}
      <div className="w-full max-w-sm bg-[#F9D9A5] text-[#4A4A4A] text-[10px] font-bold py-2.5 px-4 rounded-xl text-center shadow-sm">
        Once in the pod please press the button to start and end your session
      </div>

    </main>
  );
}
