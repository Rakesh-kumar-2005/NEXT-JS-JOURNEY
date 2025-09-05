"use client";

import useIntersectionObserver from "@/hooks/use-intersection-observer";
import {
  Crop,
  Palette,
  Scissors,
  Wrench,
  Expand,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Crop,
      title: "Smart Crop & Resize",
      description:
        "Interactive cropping with aspect ratio constraints and intelligent resizing that preserves image quality across any dimension.",
    },
    {
      icon: Palette,
      title: "Color & Light Adjustment",
      description:
        "Professional-grade brightness, contrast, saturation controls with real-time preview and auto-enhance capabilities.",
    },
    {
      icon: Scissors,
      title: "AI Background Removal",
      description:
        "Remove or replace backgrounds instantly using advanced AI that detects complex edges and fine details with precision.",
    },
    {
      icon: Wrench,
      title: "AI Content Editor",
      description:
        "Edit images with natural language prompts. Remove objects, change elements, or add new content using generative AI.",
    },
    {
      icon: Expand,
      title: "Image Extender",
      description:
        "Expand your canvas in any direction with AI-powered generative fill that seamlessly blends new content with existing images.",
    },
    {
      icon: TrendingUp,
      title: "AI Upscaler",
      description:
        "Enhance image resolution up to 4x using AI upscaling technology that preserves details and reduces artifacts.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Unleash Creative Power
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience the next generation of image editing with AI-powered
            tools that understand your creative vision
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`interactive group backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20 ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`mb-6 w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center transform transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4 transition-all duration-300 group-hover:text-blue-400 ">
        {title}
      </h3>
      <p className="text-white/70 group-hover:text-white duration-300 transition leading-relaxed">
        {description}
      </p>
    </div>
  );
};
