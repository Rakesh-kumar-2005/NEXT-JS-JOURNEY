"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

const HeroSection = () => {
  // for a little delay in visibility of the screen contents...
  const [textVisible, setTextVisible] = useState(false);

  // Hover Effect...
  const [demoHovered, setDemoHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 1000);

    return () => clearTimeout(timer);
  });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="text-center z-10 px-6">
        <div
          className={`transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0  translate-y-10"} `}
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Create
            </span>
            <br />
            <span className="text-5xl md:text-7xl tracking-wide">Without Limits</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Professional image editing powered by AI. Crop, resize, adjust
            colors, remove backgrounds, and enhance your images with
            cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <Link href="/dashboard">
              <Button 
                variant="primary" 
                size="xl"
                className="relative overflow-hidden group"
                style={{
                  boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)',
                }}
              >
                <span className="animate-bounce">🌟</span>
                Start Creating
                {/* Neon glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </Link>

            <Link href="">
              <Button
                variant="glass"
                size="xl"
                className="group transition-all duration-300 relative overflow-hidden"
                style={{
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
                }}
              >
                Watch Demo
                <span className="text-2xl transform transition-transform duration-300 group-hover:translate-x-1">
                  ›
                </span>
                {/* Ripple effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
              </Button>
            </Link>
          </div>

          {/* 3D Demo Interface */}
          <div
            className={`relative mt-20 max-w-4xl mb-9 mx-auto transition-all duration-1000 ${
              textVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            } ${demoHovered ? "transform scale-105 rotate-y-6" : ""}`}
            onMouseEnter={() => setDemoHovered(true)}
            onMouseLeave={() => setDemoHovered(false)}
            style={{ perspective: "1000px" }}
          >
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 transform-gpu">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 min-h-96">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-sm">Pixxel Pro</div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { icon: "✂️", label: "Crop" },
                    { icon: "📐", label: "Resize" },
                    { icon: "🎨", label: "Adjust" },
                    { icon: "🤖", label: "AI Tools" },
                  ].map((tool, index) => (
                    <div
                      key={index}
                      className="backdrop-blur-lg bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 text-gray-400 transition-all cursor-pointer duration-300 hover:text-white"
                      title={tool.label}
                    >
                      <div className="text-2xl mb-1">{tool.icon}</div>
                      <div className="text-xs ">{tool.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-full h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl shadow-2xl shadow-blue-500/50 flex items-center justify-center">
                    <div className="text-white font-bold">Your Canvas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
