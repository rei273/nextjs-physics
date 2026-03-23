import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";

export default function PhysTLogo() {
  return (

      <div
        // className={`${lusitana.className} flex flex-col items-center leading-none text-white`}>
        className="flex flex-col items-center justify-center leading-none text-[#DDE6ED]"
      >
        <Image
          className="rounded-lg h-40 w-40"
          src="/GVLogo_1.png"
          alt="Grok Vectors logo"
          width={1024}
          height={1024}
          priority
        />
        <div>
          <p className="text-[20px] text-[#1E3E62] mt-2">Grok Vectors AI</p>{" "}
        </div>
      
    </div>
  );
}
