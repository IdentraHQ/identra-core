"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

const SPECS = [
    {
        label: "Architecture",
        identra: "Operating layer",
        others: "Standalone tools"
    },
    {
        label: "Context",
        identra: "Local-first memory",
        others: "Cloud-first context"
    },
    {
        label: "Security",
        identra: "Confidential by default",
        others: "Trust-based security"
    }
];

export function Differentiation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section id="differentiation-section" ref={containerRef} className="bg-[#030304] relative h-[300vh] w-full">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                <div className="container px-6 max-w-5xl mx-auto w-full">
                    {/* Minimal Header - Fades out as we scroll deep */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0.5]) }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-3xl md:text-4xl text-white font-medium tracking-tight">
                            Built different.
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Central Geometric Divider with Active Boundary */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block">
                            {/* Base dim line */}
                            <div className="absolute inset-y-0 w-full bg-white/5" />

                            {/* Growing active line */}
                            <motion.div
                                style={{
                                    height: useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]),
                                }}
                                className="absolute top-0 w-full bg-gradient-to-b from-white/20 via-white/80 to-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            >
                                {/* Leading Edge "Scanner" */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
                            </motion.div>
                        </div>

                        {/* Specifications Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 md:gap-y-24">
                            {/* Headers (Desktop Only) */}
                            <div className="hidden md:block col-span-2">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="pl-12 text-xs font-mono text-white/70 uppercase tracking-widest flex items-center gap-2">
                                        Identra
                                    </div>
                                    <div className="text-xs font-mono text-white/50 uppercase tracking-widest">
                                        Others
                                    </div>
                                </div>
                            </div>

                            {SPECS.map((spec, index) => {
                                // Staggered reveal logic based on scroll progress
                                const start = 0.15 + (index * 0.25);
                                const end = start + 0.15;

                                const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
                                const y = useTransform(scrollYProgress, [start, end], [20, 0]);

                                // Micro-Haze: Blur fades from 8px to 0px
                                const blurValue = useTransform(scrollYProgress, [start, end], [8, 0]);
                                const filter = useMotionTemplate`blur(${blurValue}px)`;

                                // Brightness/Glow effect on reveal
                                const brightnessValue = useTransform(scrollYProgress, [start, end], [1.5, 1]);
                                const textFilter = useMotionTemplate`brightness(${brightnessValue})`;

                                return (
                                    <motion.div
                                        key={index}
                                        style={{ opacity, y, filter }}
                                        className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 group"
                                    >
                                        {/* Identra Column (Left) */}
                                        <motion.div
                                            style={{ filter: textFilter }}
                                            className="flex items-center gap-6 md:pl-12 relative"
                                        >
                                            {/* Micro Index */}
                                            <span className="absolute left-[-1.5rem] md:left-2 text-[10px] font-mono text-white/30 md:text-white/10 tabular-nums">
                                                0{index + 1}
                                            </span>

                                            {/* Active Node Indicator with Signal Pulse */}
                                            <div className="relative">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full relative z-10 box-decoration-clone" />
                                                <motion.div
                                                    style={{ opacity }}
                                                    className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"
                                                />
                                            </div>

                                            <span className="text-xl md:text-2xl text-white font-medium tracking-tight whitespace-nowrap md:whitespace-normal text-ellipsis overflow-hidden max-w-full">
                                                {spec.identra}
                                            </span>
                                        </motion.div>

                                        {/* Others Column (Right) */}
                                        <div className="flex items-center gap-4 md:gap-6 md:pl-0">
                                            {/* Hollow/Faint Node */}
                                            <div className="w-1.5 h-1.5 rounded-full border border-white/10 bg-transparent shrink-0" />

                                            <span className="text-lg md:text-2xl text-white/30 font-normal whitespace-nowrap md:whitespace-normal text-ellipsis overflow-hidden max-w-full">
                                                {spec.others}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
