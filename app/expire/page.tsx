'use client';

import Image from "next/image";

export default function AccessCodeExpiredPage() {

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-4 px-4 overflow-hidden">
      
      {/* pod name  */}
      <div className="bg-[#F9D9A5] px-12 py-3 rounded-xl mb-4 shadow-sm text-center">
        <h1 className="text-3xl text-[#4A4A4A] italic font-serif font-bold whitespace-nowrap">
          Pod Calm
        </h1>
      </div>

      {/* small map image */}
      <div className="relative w-full max-w-lg h-64 border border-gray-300 rounded-[2rem] overflow-hidden shadow-lg mb-4 opacity-80">
        <Image 
          src="/small_map.png" 
          alt="Small Map" 
          fill
          className="object-cover object-top" 
        />

        {/* location box */}
        <div className="absolute top-4 left-4 bg-[#DEDEDE] border border-gray-400 px-3 py-1.5 rounded-lg shadow-sm z-20">
          <p className="text-[10px] font-bold text-gray-700 leading-tight">7th floor,<br/>Building K</p>
        </div>

        {/* four boxes */}
        <div className="absolute w-10 h-10 bg-[#DEDEDE] rounded-xl border-2 border-white/50 shadow-sm" style={{ top: '32%', left: '25%' }} />
        <div className="absolute w-11 h-11 bg-[#32CD32] rounded-xl border-4 border-white shadow-xl z-10" style={{ top: '32%', left: '40%' }} />
        <div className="absolute w-10 h-10 bg-[#DEDEDE] rounded-xl border-2 border-white/50 shadow-sm" style={{ top: '42%', left: '65%' }} />
        <div className="absolute w-10 h-10 bg-[#DEDEDE] rounded-xl border-2 border-white/50 shadow-sm" style={{ top: '75%', left: '65%' }} />
      </div>

      {/* expire card */}
      <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center gap-3 mb-6">
        
        {/* logo image */}
        <div className="absolute top-5 left-6 scale-90">
          <Image src="/logo.png" alt="Logo" width={50} height={35} />
        </div>

        {/* red layout circle */}
        <div className="w-14 h-14 rounded-full border-[3px] border-[#FF4D4D] flex items-center justify-center mt-1">
          <div className="w-10 h-10 rounded-full border-2 border-[#FF4D4D]/10" />
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-black">Access Code</h2>
          <p className="text-[11px] text-[#FF4D4D] font-medium px-2">
            Unfortunately your access code has expired
          </p>
        </div>

        {/* grey expire box */}
        <div className="w-full bg-[#C8D3D5] text-black text-5xl font-black py-4 rounded-2xl text-center tracking-tighter shadow-inner">
          Expired
        </div>


        {/* info */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="py-2">
            <p className="text-[10px] text-gray-400 leading-tight px-6 text-center">
              No worries! you can rebook it again in the
            </p>
            <p className="text-[10px] text-gray-400 leading-tight px-6 text-center">
              previous page!
            </p>
          </div>
        </div>
      </div>

      {/* rebook info */}
      <div className="w-full max-w-sm bg-[#F9D9A5] text-[#4A4A4A] text-[10px] font-bold py-3 px-4 rounded-xl text-center shadow-sm">
        Please go back to rebook your session
      </div>

    </main>
  );
}