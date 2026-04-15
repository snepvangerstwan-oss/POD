import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      
      {/* upper part (About Us) */}
      <div className="bg-[#F9D9A5] px-20 py-4 rounded-xl mb-12 shadow-sm">
        <h1 className="text-4xl text-[#4A4A4A] italic font-serif font-bold">
          About Us
        </h1>
      </div>

      {/* middle part */}
      <div className="w-full max-w-lg bg-white border border-gray-50 rounded-[2rem] p-10 shadow-2xl mb-16">
        <h2 className="text-2xl font-bold text-[#00334E] mb-6">
          Welcome to Parent Pod
        </h2>

        <div className="space-y-6 text-[#4A4A4A] text-[15px] leading-relaxed">
          <p>
            Parent Pod is a dedicated space designed for parents who need a quiet, comfortable, and private environment while they're out and about.
          </p>
          <p>
            Designed to offer comfort and privacy, our pods provide a quiet space to pause, recharge, and take a moment away from the hospital environment.
          </p>

          <div>
            <h3 className="font-bold text-lg text-[#00334E] mb-2">Our Mission</h3>
            <p>
              To support parents by providing accessible, convenient, and comfortable spaces that make parenting on-the-go easier and more enjoyable.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#00334E] mb-3">Features</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Private, soundproof pods</li>
              <li>Comfortable seating</li>
              <li>Changing facilities</li>
              <li>Climate control</li>
              <li>Free Wi-Fi</li>
            </ul>
          </div>
        </div>
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
