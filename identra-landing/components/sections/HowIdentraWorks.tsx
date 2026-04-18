"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        title: "Local Context Capture",
        description: "Active window text is read using system accessibility APIs. No screenshots. No recording. Privacy first.",
    },
    {
        title: "Local Memory & Embeddings",
        description: "Context is embedded locally using on-device models for speed and privacy. Your data never leaves your RAM.",
    },
    {
        title: "Encrypted Cloud Reasoning",
        description: "Only encrypted data leaves the device. Decryption keys exist only inside secure enclaves. Zero-knowledge proof.",
    },
];

export function HowIdentraWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            // Desktop & Tablet Animation (Horizontal Scroll)
            mm.add("(min-width: 768px)", () => {
                const animation = gsap.to(sectionRef.current, {
                    x: () => -(sectionRef.current!.scrollWidth - window.innerWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: "+=3000", // Scroll distance
                        scrub: 1, // Smooth scrubbing
                        pin: true,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const index = Math.round(progress * (STEPS.length - 1));
                            setActiveIndex(index);
                        }
                    }
                });

                // Parallax/Horizontal Effect for Header
                gsap.to(headerRef.current, {
                    x: -800, // Move faster
                    opacity: 0,
                    ease: "power1.in",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: "+=800", // Fade out quicker
                        scrub: 1,
                    }
                });
            });

            // Mobile Animation (Vertical Scroll, less aggressive pinning)
            mm.add("(max-width: 767px)", () => {
                // Remove horizontal pinning entirely for mobile, make it a normal vertical scroll
                // Update active index based on which card is in view
                const cards = gsap.utils.toArray('.mobile-step-card');
                cards.forEach((card: any, index) => {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top center",
                        end: "bottom center",
                        onToggle: (self) => {
                            if (self.isActive) setActiveIndex(index);
                        }
                    });
                });
                
                // Fade out header as user scrolls down
                gsap.to(headerRef.current, {
                    y: -100,
                    opacity: 0,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: "+=400",
                        scrub: 1,
                    }
                });
            });
            
            return () => {
                mm.revert();
            };
        }, triggerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="howidentraworks" ref={triggerRef} className="relative md:h-screen w-full bg-black md:overflow-hidden pb-32 md:pb-0">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-black to-black opacity-40 pointer-events-none" />

            {/* Header (Absolute Pinned) - Platinum Gradient */}
            <div ref={headerRef} className="relative md:absolute top-28 left-6 md:left-24 z-20 pointer-events-none mix-blend-difference mb-20 md:mb-0">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-display font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50"
                >
                    How Identra Works
                </motion.h2>
            </div>

            {/* Track - Horizontal on Desktop, Vertical on Mobile */}
            <div
                ref={sectionRef}
                className="flex flex-col md:flex-row items-center md:items-end md:h-full pb-0 md:pb-32 px-6 md:pl-[30vw] md:pr-[20vw] gap-12 md:gap-[15vw] w-full md:w-fit"
            >
                {STEPS.map((step, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <div
                            key={index}
                            className={`mobile-step-card relative flex-shrink-0 w-full md:w-[45vw] lg:w-[30vw] h-auto min-h-[40vh] md:min-h-[50vh] max-h-[75vh] flex flex-col justify-end transition-all duration-700 ease-out opacity-100 scale-100 blur-0 ${isActive ? 'md:scale-100 md:opacity-100 md:blur-0' : 'md:scale-90 md:opacity-30 md:blur-[2px]'}`}
                        >
                            {/* Card Container - Full Height of Parent */}
                            <div className="relative group h-full flex flex-col w-full">
                                {/* Dark Monolith Background */}
                                <div className={`absolute inset-0 rounded-3xl transition-all duration-700 ease-out border ${isActive ? 'md:bg-gradient-to-br md:from-[#0f0f10] md:to-black md:border-white/20 md:shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)]' : 'md:bg-black/40 md:border-white/5'} bg-gradient-to-br from-[#0f0f10] to-black border-white/20`}>
                                    {/* Noise Texture */}
                                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                                    {/* Inner Top Highlight (Gloss) */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
                                </div>

                                {/* Content Container */}
                                <div className="relative h-full p-8 md:p-12 flex flex-col justify-between">
                                    {/* Top: Tag */}
                                    <div className="flex items-start justify-between">
                                        <div className={`flex flex-col gap-2 transition-all duration-500 ${isActive ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-40 md:translate-y-2'}`}>
                                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
                                                SYS_MOD_0{index + 1}
                                            </span>
                                            {/* Precision Line */}
                                            <div className={`h-px bg-gradient-to-r from-primary to-transparent transition-all duration-700 w-full ${isActive ? 'md:w-full md:opacity-100' : 'md:w-0 md:opacity-0'}`} />
                                        </div>
                                    </div>

                                    {/* Bottom: Title & Description */}
                                    <div className="flex flex-col gap-4 md:gap-8 mt-12 md:mt-0">
                                        <h3 className={`text-4xl md:text-5xl lg:text-7xl font-display font-light tracking-tighter text-white leading-[1] transition-all duration-700 ${isActive ? 'md:translate-x-0' : 'md:-translate-x-4'}`}>
                                            {step.title}
                                        </h3>

                                        <div className={`overflow-hidden transition-all duration-700 delay-100 ${isActive ? 'md:max-h-40 md:opacity-80' : 'md:max-h-0 md:opacity-0'} max-h-40 opacity-80`}>
                                            <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-xl">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
