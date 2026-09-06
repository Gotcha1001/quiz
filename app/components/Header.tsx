"use client";
import { Button } from "@/components/ui/button";
import { chart, home, login } from "@/utils/icons";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    {
      name: "Home",
      icon: home,
      link: "/",
    },
    {
      name: "My Stats",
      icon: chart,
      link: "/stats",
    },
  ];

  return (
    <header className="min-h-[8vh] px-40 xl:px-60 border-b-2 flex items-center">
      <nav className="flex-1 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src="/icon--logo-lg.png"
            alt="logo"
            width={50}
            height={50}
            className="h-32 w-32"
          />
        </Link>
        <ul className="flex item-center gap-8">
          {menu.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`py-1 px-6 flex items-center gap-2 text-lg leadning-none text-gray-400 rounded-lg ${pathname === item.link ? "bg-blue-500/20 text-blue-400 border-2 border-blue-400" : ""}`}
              >
                <span className="text-2xl text-blue-400">{item.icon}</span>
                <span
                  className={`font-bold uppercase ${pathname === item.link ? "text-blue-400" : "text-gray-400"}`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "w-12 h-12 border-2 rounded-full border-gray-300",
                },
              }}
            />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button className="px-4 py-5 gap-2 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition">
                {login} Login Sign Up
              </Button>
            </SignInButton>
          </Show>
        </div>
      </nav>
    </header>
  );
}

export default Header;
