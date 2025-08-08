"use client"

import FeaturesSection from "@/components/features";
import HeroSection from "@/components/hero";
import PricingSection from "@/components/pricing";
import StatsSection from "@/components/stats";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { useEffect } from "react";


export default function Home() {

  return (
    <div className="pt-48">

      {/* Hero... */}
      <HeroSection />

      {/* features */}
      <FeaturesSection />

      {/* stats */}
      <StatsSection />

      {/* pricing */}
      <PricingSection />

      
    </div>
  );
}
