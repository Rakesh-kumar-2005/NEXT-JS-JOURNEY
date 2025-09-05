"use client";

import { useParallax } from "@/hooks/use-parallax";
import React from "react";

const FloatingShapes = () => {
  const scrollY = useParallax();

  const shapes = [
    {
      id: 1,
      size: "w-72 h-72",
      position: "top-20 left-16",
      gradient: "from-purple-500 to-blue-600",
    },
    {
      id: 2,
      size: "w-36 h-36",
      position: "top-1 right-24",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      id: 3,
      size: "w-64 h-64",
      position: "left-1/4 bottom-20",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      id: 4,
      size: "w-52 h-52",
      position: "right-10 bottom-20",
      gradient: "from-green-400 to-cyan-500",
    },

    {
      id: 5,
      size: "w-44 h-44",
      position: "top-[200px] right-[400px]",
      gradient: "from-fuchsia-500 to-violet-600",
    },
    {
      id: 6,
      size: "w-28 h-28",
      position: "top-[70px] left-[34%]",
      gradient: "from-teal-400 to-blue-500",
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => {
        return (
          <div
            key={shape.id}
            className={`absolute ${shape.size} ${shape.position} bg-gradient-to-br ${shape.gradient} rounded-full blur-3xl animate-pulse opacity-20`}
            style={{
              transform: `translateY(${scrollY * 0.5}px) rotate(${
                scrollY * 0.5
              }deg) `,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingShapes;
