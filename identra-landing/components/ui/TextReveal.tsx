"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
}

export function TextReveal({ text, className = "", delay = 0, duration = 1 }: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".word",
                {
                    opacity: 0,
                    y: 20, // Slight slide up
                    filter: "blur(12px)", // Cinematic blur start
                    transform: "translateZ(0)", // GPU
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 1.4, // Slower, luxurious timing
                    stagger: 0.04, // Tight ripple
                    ease: "power2.out", // Soft landing
                    delay: delay,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [text, delay, duration]);

    // Masked Word Reveal
    const renderContent = () => {
        const words = text.split(" ");
        return words.map((word, wordIndex) => (
            // Overflow hidden wrapper acts as the "mask"
            <span key={wordIndex} className="inline-block overflow-hidden align-bottom mr-[0.25em] -mb-2 pb-2">
                <span
                    className="word inline-block will-change-transform" // Optimized target
                    style={{
                        opacity: 0, // Prevent FOUC
                        whiteSpace: "normal",
                        backfaceVisibility: "hidden", // Fix jagged edges
                        WebkitFontSmoothing: "antialiased"
                    }}
                >
                    {word}
                </span>
            </span>
        ));
    };

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            <div className="leading-[1.1]">
                {renderContent()}
            </div>
        </div>
    );
}
