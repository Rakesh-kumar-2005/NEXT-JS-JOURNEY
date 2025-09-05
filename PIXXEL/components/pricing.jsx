"use client";

import useIntersectionObserver from "@/hooks/use-intersection-observer";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState } from "react";

const PricingCard = ({
  id,
  plan,
  price,
  features,
  featured = false,
  planId,
  buttonText,
}) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [isHovered, setIsHovered] = useState(false);
  const { has } = useAuth();

  // Check if user has this specific plan
  const isCurrentPlan = id ? has?.({ plan: id }) : false;

  const handlePopup = async () => {
    if (isCurrentPlan) return; // Don't open checkout for current plan

    try {
      if (window.Clerk && window.Clerk.__internal_openCheckout) {
        await window.Clerk.__internal_openCheckout({
          planId: planId,
          planPeriod: "month",
          subscriberType: "user",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div
      ref={ref}
      className={`relative backdrop-blur-lg border rounded-3xl p-8 transition-all duration-700 cursor-pointer ${
        featured
          ? "bg-gradient-to-b from-blue-500/20 to-purple-600/20 border-blue-400/50 scale-100"
          : "bg-white/5 border-white/10"
      } ${isVisible ? "opacity-100 translate-y-0 " : "opacity-0 translate-y-10"} ${
        isHovered ? "transform scale-110  z-10" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{plan}</h3>
        <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-6">
          ${price}
          {price > 0 && <span className="text-lg text-gray-400">/month</span>}
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <span className="text-emerald-400 mr-3">✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant={featured ? "primary" : "glass"}
          size="xl"
          className="w-[90%] rounded-full transition-all duration-300 hover:scale-105"
          onClick={handlePopup}
          disabled={isCurrentPlan || !planId}
        >
          {isCurrentPlan ? "Current Plan" : buttonText}
        </Button>
      </div>
    </div>
  );
};

// Pricing Section Component
const PricingSection = () => {
  const plans = [
    {
      id: "free_user",
      plan: "Free",
      price: 0,
      features: [
        "3 Projects Per Month",
        "6 Exports Per Month",
        "Basic Crop And Resize",
        "Color Adjustments",
        "Standard Quality Exports",
      ],
      buttonText: "Get Started Free",
    },
    {
      id: "pro",
      plan: "Pro",
      price: 12,
      features: [
        "Unlimited Projects",
        "Unlimited Exports In High Quality",
        "All Editing Tools",
        "AI Background Removal And Generator",
        "AI Extend, Retouch And More...",
      ],
      featured: true,
      planId: "cplan_30xh3DefngKe5XtkVVvrscm5G3X",
      buttonText: "Upgrade to Pro",
    },
  ];

  return (
    <section className="py-20" id="pricing">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Choose Your Power Level
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered image editing with our flexible plans
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;