import Image from "next/image";
import Link from "next/link"; 

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      
      {/* top name (Parent Pod) */}
      <div className="bg-[#F9D9A5] px-16 py-4 rounded-xl mb-12 shadow-sm">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold">
          Parent Pod
        </h1>
      </div>

      {/* pod main image */}
      <div className="w-full max-w-md mb-12 overflow-hidden rounded-3xl shadow-lg">
        <Image 
          src="/pod-main.png" 
          alt="Main Pod Image" 
          width={500} 
          height={400} 
          layout="responsive"
          className="object-cover"
          priority
        />
      </div>

      {/* buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        
        {/* Select Pod -> /pick */}
        <Link href="/pick" className="w-full">
          <button className="w-full py-4 bg-[#516468] text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
            Select Pod
          </button>
        </Link>

        {/* Information -> /info */}
        <Link href="/info" className="w-full">
          <button className="w-full py-4 bg-[#7D9498] text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
            Information
          </button>
        </Link>

        {/* About Us -> /about */}
        <Link href="/about" className="w-full">
          <button className="w-full py-4 bg-[#C8D3D5] text-[#516468] font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
            About us
          </button>
        </Link>
        
      </div>

      {/* logoimage */}
      <footer className="mt-auto pt-10 pb-6">
        <Image 
          src="/logo.png" 
          alt="Parent Pod Logo" 
          width={100} 
          height={60} 
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </footer>

    </main>
  );
}