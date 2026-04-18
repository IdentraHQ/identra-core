"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CometCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cometColor?: string;
  cometHoverColor?: string;
}

export const CometCard = forwardRef<HTMLDivElement, CometCardProps>(
  ({ children, className, cometColor = "rgba(255,255,255,0.7)", cometHoverColor = "rgba(59,130,246,0.8)", ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("relative overflow-hidden rounded-xl group", className)} 
        {...props}
      >
        {/* Comet Border Glow */}
        <div 
          className="absolute inset-[0] z-0 rounded-xl animate-[spin_3s_linear_infinite] transition-colors duration-500" 
          style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 340deg, ${cometColor} 360deg)` }}
        />
        <div 
          className="absolute inset-[0] z-0 rounded-xl animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 340deg, ${cometHoverColor} 360deg)` }}
        />

        {/* Opposite Comet */}
        <div 
          className="absolute inset-[0] z-0 rounded-xl animate-[spin_3s_linear_infinite] transition-colors duration-500" 
          style={{ backgroundImage: `conic-gradient(from 180deg, transparent 0 340deg, ${cometColor} 360deg)` }}
        />
        <div 
          className="absolute inset-[0] z-0 rounded-xl animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ backgroundImage: `conic-gradient(from 180deg, transparent 0 340deg, ${cometHoverColor} 360deg)` }}
        />

        {/* Inner Mask */}
        <div className="absolute inset-[1px] z-10 rounded-xl bg-[#080808] transition-all duration-500 group-hover:bg-[#0c0c0c]" />
        
        {/* Internal Content */}
        <div className="relative z-20 h-full w-full">
          {children}
        </div>
      </div>
    );
  }
);
CometCard.displayName = "CometCard";
