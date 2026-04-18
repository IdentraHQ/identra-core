"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function SecurityTrust() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // --- SCROLL ANIMATION VALUES ---

    // Header Logic
    // Increased fade speed [0, 0.15] so it disappears faster before overlap
    const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

    // Card 1: INFRASTRUCTURE (Base Layer)
    const card1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    const card1Opacity = useTransform(scrollYProgress, [0.3, 0.8], [1, 0.5]);
    // Removed heavy dynamic blur for mobile performance
    // const card1Filter = useTransform(scrollYProgress, [0.3, 0.8], ["blur(0px)", "blur(4px)"]);

    // Card 2: RUNTIME (Middle Layer)
    // Enters from bottom, slides to cover ~85%
    const card2Y = useTransform(scrollYProgress, [0.15, 0.55], ["110%", "15%"]);
    const card2Scale = useTransform(scrollYProgress, [0.55, 1], [1, 0.98]);

    // Card 3: ENCLAVE (Top Layer)
    // Enters last, locks on top
    const card3Y = useTransform(scrollYProgress, [0.55, 0.9], ["110%", "30%"]);

    return (
        <section id="security-section" ref={containerRef} className="relative h-[250vh] bg-[#030304] w-full">

            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)]">

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_40px] opacity-20 pointer-events-none" />

                {/* Main Header - MOVED UP & Fades Out Faster */}
                <motion.div
                    className="absolute top-12 md:top-20 text-center z-50 mix-blend-difference"
                    style={{ opacity: headerOpacity, y: headerY }}
                >
                    <h2 className="text-xs font-mono text-white/60 uppercase tracking-[0.3em] mb-4">
                        Defense Architecture
                    </h2>
                    <p className="text-4xl md:text-5xl font-medium text-white tracking-tighter">
                        The Trust Stack
                    </p>
                </motion.div>


                {/* THE STACK CONTAINER - MOVED DOWN */}
                {/* Increased mt to 32 (128px) to provide ample gap from header */}
                <div className="relative w-full max-w-lg md:max-w-4xl h-[500px] mt-32 md:mt-40">

                    {/* Vertical Connection Spine (Behind) */}
                    <div className="absolute left-10 top-4 bottom-4 w-[1px] bg-white/10 z-0 hidden md:block" />


                    {/* --- CARD 1: TRANSPORT --- */}
                    <motion.div
                        className="absolute inset-0 w-full h-[380px] rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md md:backdrop-blur-xl flex flex-col overflow-hidden z-10"
                        style={{ scale: card1Scale, opacity: card1Opacity }}
                    >
                        {/* Identify Stripe */}
                        <div className="w-full h-1 bg-blue-500/30" />

                        <div className="p-6 md:p-10 flex items-start gap-4 md:gap-8 h-full">
                            {/* Icon Box */}
                            <div className="hidden md:flex flex-col items-center gap-4 pt-2">
                                <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/70 shadow-lg shadow-black/20">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div className="flex-1 w-[1px] bg-blue-500/20" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xl md:text-xl md:text-2xl font-medium text-white">Transport Layer</h3>
                                    <span className="text-[10px] font-mono text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full bg-blue-500/10 tracking-widest">INFRASTRUCTURE</span>
                                </div>

                                <p className="text-sm md:text-sm md:text-base text-muted-foreground/80 leading-relaxed mb-8 max-w-2xl">
                                    All data in transit is protected by <span className="text-white/90 font-medium">AES-256 encryption</span> across our global edge network. No plaintext ever touches the wire.
                                </p>

                                {/* Visualization */}
                                <div className="w-full h-32 rounded-lg border border-white/5 bg-black/30 p-4 md:p-4 md:p-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%)] animate-[shimmer_4s_infinite]" />
                                    <div className="flex justify-between text-[10px] font-mono text-white/40 mb-4 tracking-widest uppercase">
                                        <span>TLS 1.3 Handshake</span>
                                        <span className="text-blue-400">Verified</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="h-1.5 w-full bg-blue-500/10 rounded-full overflow-hidden"
                                            >
                                                <motion.div
                                                    className="h-full bg-blue-500"
                                                    animate={{ x: ["-100%", "100%"] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.08, ease: "linear" }}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* --- CARD 2: MEMORY --- */}
                    <motion.div
                        className="absolute inset-0 w-full h-[380px] rounded-xl border border-white/10 bg-[#0c0c0c] shadow-2xl md:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-20"
                        style={{ y: card2Y, scale: card2Scale }}
                    >
                        {/* Identify Stripe */}
                        <div className="w-full h-1 bg-emerald-500/30" />

                        <div className="p-6 md:p-10 flex items-start gap-4 md:gap-8 h-full">
                            {/* Icon Box */}
                            <div className="hidden md:flex flex-col items-center gap-4 pt-2">
                                <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/70 shadow-lg shadow-black/20">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M2 15h10" /><path d="m9 18 3-3-3-3" /></svg>
                                </div>
                                <div className="flex-1 w-[1px] bg-emerald-500/20" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xl md:text-xl md:text-2xl font-medium text-white">Ephemeral Memory</h3>
                                    <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/10 tracking-widest">RUNTIME</span>
                                </div>

                                <p className="text-sm md:text-sm md:text-base text-muted-foreground/80 leading-relaxed mb-8 max-w-2xl">
                                    Zero persistence processing. Data exists only in <span className="text-white/90 font-medium">volatile memory</span> during execution and is instantly wiped upon completion.
                                </p>

                                {/* Visualization */}
                                <div className="w-full h-32 rounded-lg border border-white/5 bg-black/50 p-4 md:p-4 md:p-6 relative overflow-hidden flex items-center justify-center">
                                    <div className="text-xs font-mono text-emerald-500/50 tracking-[0.2em] uppercase">No Disk Writes Detected</div>
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,185,129,0.03)_0%,transparent_100%)]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* --- CARD 3: ENCLAVE --- */}
                    <motion.div
                        className="absolute inset-0 w-full h-[380px] rounded-xl border border-white/20 bg-[#111] shadow-2xl md:shadow-[0_-20px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-30"
                        style={{ y: card3Y }}
                    >
                        {/* Identify Stripe */}
                        <div className="w-full h-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" />

                        <div className="p-6 md:p-10 flex items-start gap-4 md:gap-8 h-full">
                            {/* Icon Box */}
                            <div className="hidden md:flex flex-col items-center gap-4 pt-2">
                                <div className="w-12 h-12 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xl md:text-xl md:text-2xl font-medium text-white">Secure Enclave</h3>
                                    <span className="text-[10px] font-mono text-white border border-white/30 px-3 py-1 rounded-full bg-white/10 tracking-widest">HARDWARE</span>
                                </div>

                                <p className="text-sm md:text-sm md:text-base text-muted-foreground/80 leading-relaxed mb-8 max-w-2xl">
                                    Computation occurs within a <span className="text-white/90 font-medium">Trusted Execution Environment (TEE)</span>, isolated from the OS and hypervisor. Even we cannot see inside.
                                </p>

                                {/* Visualization */}
                                <div className="w-full h-32 rounded-lg border border-white/10 bg-white/[0.03] p-4 md:p-4 md:p-6 flex items-center justify-between px-8 md:px-12">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">System Integrity</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                                            <span className="text-lg font-medium text-white">Verified</span>
                                        </div>
                                    </div>

                                    <div className="h-12 w-[1px] bg-white/10" />

                                    <div className="flex flex-col gap-2 items-end">
                                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Root Access</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <span className="text-lg font-medium text-white/50 line-through decoration-red-500/50">Denied</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
