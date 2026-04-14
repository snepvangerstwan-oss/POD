"use client";

import React, { useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

export default function ZenPodPage() {
  const imgRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<any>(null);

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

  const onUpdate = useCallback(({ x, y, scale }: { x: number; y: number; scale: number }) => {
    if (imgRef.current) {
      const value = make3dTransformValue({ x, y, scale });
      imgRef.current.style.setProperty("transform", value);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      
      {/* Pod name */}
      <div className="bg-[#F9D9A5] px-20 py-4 rounded-xl mb-10 shadow-sm text-center">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          Pod Zen
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
              layout="responsive"
              className="object-contain pointer-events-none"
              priority 
            />

            {/* red pod */}
            <div 
              className="absolute w-5 h-5 bg-[#FF4D4D] rounded-lg border-4 border-white shadow-xl scale-110 z-10" 
              style={{ top: '55.5%', left: '45.2%' }} 
            />
            
            {/* pther grey pod */}
            <div className="absolute w-5 h-5 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm" style={{ top: '55.5%', left: '51.3%' }} />
            <div className="absolute w-5 h-5 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm" style={{ top: '67.5%', left: '60.8%' }} />
            <div className="absolute w-5 h-5 bg-[#DEDEDE] rounded-lg border-2 border-white/50 shadow-sm" style={{ top: '60.3%', left: '60.8%' }} />
          </div>
        </QuickPinchZoom>
      </div>

      {/* info text current state */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 mb-6">
        <div className="w-full bg-[#FCE4E4] text-[#FF4D4D] py-4 px-6 rounded-xl flex items-center justify-center gap-3 border border-[#F9CACA]">
          <div className="w-4 h-4 bg-[#FF4D4D] rounded-full" />
          <span className="font-bold text-lg">Currently in use</span>
        </div>
      </div>

      {/* waiting time info box */}
      <div className="w-full max-w-sm bg-[#F9D9A5] rounded-xl p-6 mb-4 shadow-sm text-center">
        <p className="text-[#4A4A4A] text-lg font-medium mb-1">Estimated wait:</p>
        <p className="text-[#000000] text-2xl font-bold italic">About 50 minutes</p>
      </div>

      <p className="text-xs text-center text-gray-400 leading-relaxed px-10 mb-10">
        This pod is being used right now. You might want to try another pod or come back soon.
      </p>

      {/* 🔗 return button */}
      <Link href="/pick">
        <button className="bg-[#C8D3D5] text-[#4A4A4A] font-bold py-3 px-12 rounded-xl shadow-md mb-12 hover:bg-[#b8c5c7] transition-colors">
          Back to main map
        </button>
      </Link>

      <footer className="mt-auto pt-10 pb-6 text-center">
        <Image src="/logo.png" alt="Logo" width={110} height={70} className="object-contain inline-block" />
      </footer>

    </main>
  );
}