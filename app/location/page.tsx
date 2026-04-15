"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LocationPage() {
  const steps = [
    "Go straight ahead, then turn right and take the stairs up ",
    "At the top, continue straight toward the windows on the right",
    "The pod is there!",
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      
      {/* Header: Pod Name  */}
      <div className="bg-[#F9D9A5] px-16 py-4 rounded-xl mb-8 shadow-sm text-center">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          Pod Calm
        </h1>
      </div>

      {/* Pod Picture  */}
      <div className="relative w-full max-w-md border-4 border-dashed border-gray-300 rounded-3xl overflow-hidden mb-8 bg-gray-50 aspect-square flex items-center justify-center">
        <Image 
          src="/pod.png"
          alt="Pod Picture" 
          width={500} 
          height={500} 
          className="object-cover w-full h-full"
          priority 
        />
      </div>

      {/* How to get there? */}
      <div className="w-full max-w-md px-4 mb-12">
        <h2 className="text-2xl text-[#4A4A4A] font-bold text-center mb-6">
          How to get there?
        </h2>
        
        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
              <span className="bg-[#F9D9A5] text-[#4A4A4A] font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <p className="text-[#4A4A4A] text-lg font-medium pt-0.5">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/*  Back to map button */}
      <Link href="/pick">
        <button className="bg-[#C8D3D5] text-[#4A4A4A] font-bold py-3 px-12 rounded-xl shadow-md mb-12 hover:bg-[#b8c5c7] transition-all active:scale-95">
          Back to map
        </button>
      </Link>

      {/* small logo */}
      <footer className="mt-auto pt-10 pb-6 text-center">
        <Image 
          src="/logo.png" 
          alt="Parent Pod Logo" 
          width={110} 
          height={70} 
          className="object-contain inline-block" 
          style={{ width: 'auto', height: 'auto' }} 
        />
      </footer>
    </main>
  );
}
