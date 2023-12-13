"use client";

import { rockSalt } from "@/utils/fonts";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="w-full bg-black p-5">
      <Link href="/" className={`${rockSalt.className} text-2xl relative`}>
        <span className="text-[#04D6C4cF] absolute z-10">
          TypingExecutioner.com
        </span>
        <span className="text-red-500 absolute pl-0.5">
          TypingExecutioner.com
        </span>
      </Link>
    </nav>
  );
}
