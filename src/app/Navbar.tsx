"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="container mx-auto flex justify-between p-4">
        <Link href="/">LOGO</Link>
        <nav className="flex gap-4">
        <Link href="/generate">Generate</Link>
        <Link href="/collection">Collection</Link>
        </nav>
        <div>Sign in</div>
      </div>
    </div>
  );
}
