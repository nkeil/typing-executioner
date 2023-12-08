"use client";

import { rockSalt } from "@/utils/fonts";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="w-full bg-black p-5">
      <Link href="/" className={`${rockSalt.className} text-2xl text-white`}>
        TypingExecutioner.com
      </Link>
    </nav>
  );
}
