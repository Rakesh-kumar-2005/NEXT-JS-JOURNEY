"use client"

import React from 'react'
import AnimatedCounter from './animated-counter';
import { useState ,useEffect } from 'react';

const StatsSection = () => {
 const stats = [
    { label: "Images Enhanced", target: 2500000, suffix: "+" },
    { label: "Neural Networks", target: 50, suffix: "+" },
    { label: "Processing Speed", target: 300, suffix: "% faster" },
    { label: "User Satisfaction", target: 99, suffix: "%" }
  ];

  // for a little delay in visibility of the screen contents...
    const [textVisible, setTextVisible] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => setTextVisible(true), 1500);
  
      return () => clearTimeout(timer);
    });

  return (
    <section className={`w-full flex items-center justify-center`}>
      <div className={`max-w-6xl`}>
        <div className="backdrop-blur-lg transition-all duration-600 hover:scale-103 bg-white/5 border border-white/10 rounded-3xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-4">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <p className="text-white/80 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;