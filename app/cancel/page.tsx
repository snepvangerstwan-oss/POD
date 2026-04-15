'use client';

import Image from "next/image";
import Link from "next/link";

export default function ReservationCancelledPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-4 px-4 overflow-hidden">
      
      {/* upper part (Cancelled) */}
      <div className="bg-[#F9D9A5] px-12 py-3 rounded-xl mb-4 shadow-sm text-center">
        <h1 className="text-3xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          Cancelled
        </h1>
      </div>


      {/* cancel info */}
      <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center gap-3 mb-6">
        
        {/* logo image */}
        <div className="absolute top-5 left-6 scale-90">
          <Image src="/logo.png" alt="Logo" width={50} height={35} />
        </div>

        {/* upper part text */}
        <div className="flex flex-col items-center text-center mt-4">
          <h2 className="text-xl font-bold text-black">Reservation Cancelled</h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Your pod reservation has been<br/>successfully cancelled
          </p>
        </div>

        {/* pink box */}
        <div className="w-full bg-[#FCE4E4] border border-[#F9CACA] p-5 rounded-2xl text-center">
          <p className="text-[11px] text-[#FF4D4D] font-medium leading-relaxed">
            The pod is now available for other parents. Would you like to return home or select another pod?
          </p>
        </div>

        {/* text */}
        <p className="text-[10px] text-gray-400 font-medium">
          No worries, you can book again anytime!
        </p>

        {/* button */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <Link href="/">
            <button className="w-full bg-[#FFB347] text-black font-bold py-3 rounded-xl text-sm shadow-md hover:bg-[#ffa526] transition-colors">
              Go to Home Page
            </button>
          </Link>
          <Link href="/pick">
            <button className="w-full bg-[#F9D9A5] text-[#4A4A4A] font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-[#e7c997] transition-colors">
              Select Another Pod
            </button>
          </Link>
        </div>
      </div>

      {/* logo image */}
      <div className="mt-auto pb-4">
        <Image src="/logo.png" alt="Logo" width={80} height={50} className="opacity-40" />
      </div>

    </main>
  );
}
