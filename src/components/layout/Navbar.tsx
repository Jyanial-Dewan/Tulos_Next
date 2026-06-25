"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Menu, ShoppingBag, User } from "lucide-react";
import { navLinks } from "@/data/data";
import Image from "next/image";
import logo from "@/images/tulos_logo.png";
import Dropdown from "../Topbar/Dropdown";

export default function Navbar() {
  return (
    <nav className="py-3 bg-white sticky top-0 shadow-md z-10">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        {/* Menu Button */}
        <button className="md:hidden">
          <Menu />
        </button>

        {/* Logo */}
        <Link href={"/"} className="cursor-pointer flex  gap-1 items-center">
          <Image src={logo} alt="logo" height={40} width={40} />
          <h3 className="font-extrabold text-lg">Tulos</h3>
        </Link>
        {/* Nav Links */}
        <div className="md:flex items-center gap-6 hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-orange-600 hover:scale-105 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 items-center">
          <Button asChild className="rounded-full cursor-pointer w-7 h-7 p-1.5">
            <Heart className="text-white" />
          </Button>
          <Button asChild className="rounded-full cursor-pointer w-7 h-7 p-1.5">
            <ShoppingBag className="text-white" />
          </Button>
          <Dropdown>
            <Button
              asChild
              className="rounded-full cursor-pointer w-7 h-7 p-1.5"
            >
              <User className="text-white" />
            </Button>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}
