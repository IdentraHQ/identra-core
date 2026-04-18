"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LayoutTextFlip } from "@/components/ui/LayoutTextFlip";
import { OSDownloadBlock } from "@/components/ui/OSDownloadBlock";
import { WaitlistForm } from "@/components/ui/WaitlistForm"; // We can keep import if needed elsewhere, but we'll remove it.

export function Hero() {
    // containerRef removed as it was unused

    return (
        <section id="hero-section" className="relative min-h-[100svh] w-full flex flex-col justify-center pt-24 pb-12 md:pt-0 md:pb-0 overflow-hidden bg-transparent">
            {/* Atmosphere Layer: Volumetric Light & Fog */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Mobile Text Readability Gradient */}
                <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-[#030304] via-[#030304]/80 to-transparent md:hidden z-0" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 w-full">
                <div className="max-w-5xl">
                    {/* Headline - Flipping Effect */}
                    <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground mb-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <LayoutTextFlip
                                text="The OS Layer that remembers"
                                words={["your work.", "your ideas.", "your system.", "your context."]}
                                wordClassName="text-white/40"
                            />
                        </motion.div>
                    </h1>

                    {/* Subheadline - Delayed Entrance */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5, // Much earlier (was 1.2)
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <h2 className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                            A confidential AI operating layer built for deep focus, persistent
                            context, and secure workflows.
                        </h2>
                    </motion.div>

                    {/* CTAs - Delayed Entrance */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.7, // (was 1.4)
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex flex-col w-full max-w-lg mt-8 md:mt-4"
                    >
                        {/* Enterprise Grade Auto-Detect Download Block */}
                        <OSDownloadBlock />

                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-white/40">
                            <div className="flex items-center gap-3">
                                <span className="flex h-6 items-center rounded-full border border-white/10 bg-white/5 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#888] backdrop-blur-md">
                                     V1.0
                                </span>
                                <span className="font-light tracking-wide text-[#666]">Production Release</span>
                            </div>
                            <span className="hidden sm:block text-white/20 font-thin">|</span>
                            <a 
                                href="#howidentraworks" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector('#howidentraworks')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex items-center text-white/50 hover:text-white transition-colors duration-300 cursor-pointer group font-light tracking-wide decoration-transparent"
                            >
                                Explore architecture <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1 opacity-70" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
