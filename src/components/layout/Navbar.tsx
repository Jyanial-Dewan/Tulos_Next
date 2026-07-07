"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { navLinks } from "@/data/data";
import Image from "next/image";
import logo from "@/images/tulos_logo.png";
import Dropdown from "../Topbar/Dropdown";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="py-3 bg-white sticky top-0 shadow-md z-10">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        {/* Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
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
              className={`px-3 py-1.5 rounded-md transition-all duration-300 ${isActive(link.href)
                ? "text-orange-600 hover:text-orange-400 hover:scale-105"
                : "hover:text-orange-400 hover:scale-105"
                }`}
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

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-30 transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>
        <div className="flex flex-col px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3 py-1.5 rounded-md transition-colors duration-300 ${isActive(link.href)
                ? "text-orange-600 hover:text-orange-400 hover:scale-105"
                : "hover:text-orange-400 hover:scale-105"
                }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
