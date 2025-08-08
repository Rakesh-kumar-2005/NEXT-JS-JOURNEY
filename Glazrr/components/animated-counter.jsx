"use client"

import React, { useState, useEffect } from 'react'
import useIntersectionObserver from "@/hooks/use-intersection-observer";



const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.5 });

  useEffect(() => {
    if (!isIntersecting) return;

    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isIntersecting, target, duration]);

  return (
    <span ref={ref} className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter
