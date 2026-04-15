import Image from "next/image";

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      
      {/* info name */}
      <div className="bg-[#F9D9A5] px-20 py-4 rounded-xl mb-12 shadow-sm">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold">
          Information
        </h1>
      </div>

      {/* middle part for info */}
      <div className="w-full max-w-lg bg-white border border-gray-50 rounded-[2rem] p-10 shadow-2xl mb-16">
        <h2 className="text-2xl font-bold text-[#00334E] mb-8 text-center">
          How Parent Pod Works
        </h2>

        <div className="space-y-8 text-[#4A4A4A]">
          <div>
            <h3 className="font-bold text-lg mb-2">1. Select a Pod</h3>
            <p className="text-[15px] leading-relaxed text-gray-600">
              Browse the map and click on any available pod (marked in green) to see its details.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">2. Reserve Your Space</h3>
            <p className="text-[15px] leading-relaxed text-gray-600">
              If the pod is vacant, click "Use Pod" to reserve it. You'll receive a unique access code.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">3. Get to the Pod</h3>
            <p className="text-[15px] leading-relaxed text-gray-600">
              You have 15 minutes to reach the pod using your access code before it expires.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">4. Enjoy Your Time</h3>
            <p className="text-[15px] leading-relaxed text-gray-600">
              Once inside, you have 2 hours of quiet, private space to relax, work, or spend time with your child.
            </p>
          </div>
        </div>
      </div>

       <div className="w-full max-w-sm bg-[#F9D9A5] text-[#4A4A4A] text-[13px] font-bold py-3 px-4 rounded-xl text-center shadow-sm">
        Please keep in mind that if you leave the pod for more than 15 minutes the pod will automatically reset and you will not be able to enter anymore.
      </div>

      {/* logo image */}
      <footer className="mt-auto pt-10 pb-6">
        <Image 
          src="/logo.png" 
          alt="Parent Pod Logo" 
          width={110} 
          height={70} 
          className="object-contain"
        />
      </footer>

    </main>
  );
}
