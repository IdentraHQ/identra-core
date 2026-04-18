"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ShutterRevealProps {
    children: ReactNode;
    className?: string;
    trigger?: boolean; // Manual trigger override
}

export function ShutterReveal({ children, className = "" }: ShutterRevealProps) {
    const container = useRef<HTMLDivElement>(null);
    const shutter = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!container.current || !shutter.current) return;

            // Initial state
            gsap.set(shutter.current, { scaleY: 1, transformOrigin: "bottom" });
            gsap.set(container.current, { opacity: 1 }); // Ensure visibility

            gsap.to(shutter.current, {
                scaleY: 0,
                duration: 1.2,
                ease: "power4.inOut",
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 80%", // Reveal when top of element hits 80% viewport
                    toggleActions: "play none none reverse",
                }
            });

            // Parallax image slightly opposite to shutter
            gsap.fromTo(container.current.children[0],
                { scale: 1.2 },
                {
                    scale: 1,
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: container.current,
                        start: "top 80%",
                    }
                }
            );

        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={container} className={`relative overflow-hidden ${className} opacity-0`}>
            {children}
            <div
                ref={shutter}
                className="absolute inset-0 bg-[#0A0A0B] z-20 pointer-events-none" // Mask color matches background
            />
        </div>
    );
}
