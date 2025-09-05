"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { useStoreUser } from "@/hooks/use-store-user";
import { BarLoader } from "react-spinners";
import { Authenticated, Unauthenticated } from "convex/react";
import { LayoutDashboard } from "lucide-react";

const Header = () => {
  const path = usePathname();
  const { isLoading } = useStoreUser();

  // Header will disappear if the user is in editor section...
  if (path.includes("/editor")) {
    return null;
  }

  // Function to check if a section is active based on hash or scroll position
  const isActiveSection = (sectionId) => {
    // You can implement scroll-based detection or hash-based detection here
    // For now, using hash-based detection
    if (typeof window !== 'undefined') {
      return window.location.hash === `#${sectionId}`;
    }
    return false;
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-nowrap">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-8 py-3 flex items-center justify-between gap-8">
        <Link href="/" className="mr-10 md:mr-20">
          <Image
            src="/logo-text.png"
            height={24}
            width={96}
            alt="Pixxel Logo"
            className="min-w-24 object-cover"
          />
        </Link>

        {path === "/" && (
          <div className="hidden md:flex space-x-6">
            <Link
              href="#features"
              className="relative group transition-all duration-300 font-medium text-white hover:text-cyan-400 cursor-pointer py-1"
            >
              Features
              {/* Underline */}
              <span 
                className={`absolute left-0 bottom-0 h-0.5 bg-cyan-400 transition-all duration-300 ease-out ${
                  isActiveSection('features') 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
            <Link
              href="#pricing"
              className="relative group transition-all duration-300 font-medium text-white hover:text-cyan-400 cursor-pointer py-1"
            >
              Pricing
              {/* Underline */}
              <span 
                className={`absolute left-0 bottom-0 h-0.5 bg-cyan-400 transition-all duration-300 ease-out ${
                  isActiveSection('pricing') 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
            <Link
              href="#contact"
              className="relative group transition-all duration-300 font-medium text-white hover:text-cyan-400 cursor-pointer py-1"
            >
              Contact
              {/* Underline */}
              <span 
                className={`absolute left-0 bottom-0 h-0.5 bg-cyan-400 transition-all duration-300 ease-out ${
                  isActiveSection('contact') 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 ml-10 md:ml-20">
          <Unauthenticated>
            <SignInButton>
              <Button variant="glass" className="hidden sm:flex rounded-full">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="primary" className="rounded-full">
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
          <Authenticated>
            <Link href="/dashboard">
              <Button variant="glass" className="rounded-full border duration-300 transition hover:border hover:border-white">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:flex">Dashboard</span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </Authenticated>
        </div>

        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <BarLoader width={"95%"} color="#06b6d4" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;