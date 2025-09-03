import { div } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Image
        src="/logo.png"
        alt="logo"
        width={100}
        height={100}
        className="rounded-full aspect-square object-cover shadow-lg ml-20 mt-10"
      />
      <div className="flex justify-center items-center py-30 px-30">
        <div>
          <p className="font-bold text-6xl text-[#1921D5]">
            Summarize{" "}
            <span className="text-[#111827]">Any Book in Seconds with AI</span>
          </p>

          <p className="text-[#111827]">
            Upload your text or search a book → instant AI summaries, character
            maps & recommendations.
          </p>

          <Link href="/upload">
            <button className="bg-[#1921D5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10">
              Try it now
            </button>
          </Link>
        </div>

        <div>
          <Image
            src="/woman_reading.jpg"
            alt="woman reading a book"
            width={300}
            height={300}
            className="rounded-full aspect-square object-cover shadow-lg ml-20"
          />
        </div>
      </div>
    </div>
  );
}
