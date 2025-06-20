

import logo from "@/public/nlogo.svg";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({wid , textClassName, textClassHidden} : {wid : number , textClassName? : string, textClassHidden? : string }) {
  return (
    <Link
    href={'/'}
    className="flex lg:ml-2 md:ml-0 items-start justify-start my-auto gap-4 cursor-pointer"
  >
    <div className="flex items-start">
      <Image
        src={logo.src}
        alt="logo"
        width={wid}
        height={logo.height}
      />
      <div className={cn("my-0 ml-1 p-0 hidden lg:block",textClassHidden || "")} >
        <p className={cn("text-xs tracking-wider uppercase text-teal-800 font-bold",textClassName || "")}>
          Perum
        </p>
        <p className={cn("text-xs tracking-wider uppercase text-teal-800 font-bold",textClassName || "")}>
          Bayuangga
        </p>
      </div>
    </div>
  </Link>

  )
}