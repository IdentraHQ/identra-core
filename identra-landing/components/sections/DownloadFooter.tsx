"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { OSDownloadBlock } from "@/components/ui/OSDownloadBlock";

export function DownloadFooter() {
    return (
        <section className="w-full pt-24 pb-8 md:pt-32 md:pb-12 bg-black relative overflow-hidden flex flex-col items-center border-t border-white/[0.05]">
            {/* Ambient Background - Ultra subtle premium texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />

            {/* Drifting Nebula 1 - Indigo */}
            <motion.div
                className="hidden md:block absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -30, 30, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Drifting Nebula 2 - Teal/Cyan (Complementary) */}
            <motion.div
                className="hidden md:block absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
                animate={{
                    x: [0, -30, 30, 0],
                    y: [0, 50, -50, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            {/* Scanning Beam */}
            <motion.div
                className="hidden md:block absolute inset-x-0 h-[200px] bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none"
                animate={{ top: ["-20%", "120%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            <div className="container px-6 relative z-10 w-full max-w-7xl mx-auto">

                {/* Main Content Split: Text Left, Buttons Right */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-12">

                    {/* Left: Headline & Subhead */}
                    <div className="text-left max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl md:text-8xl font-medium tracking-tighter text-white mb-6 leading-[0.9]"
                        >
                            Download <br />Identra.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-neutral-500 text-xl font-light tracking-wide max-w-md"
                        >
                            Free for personal use. <br />
                            <span className="text-neutral-400">Download the OS layer designed for deep work.</span>
                        </motion.p>
                    </div>

                    {/* Right: Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="w-full max-w-[100vw] md:w-auto overflow-hidden md:overflow-visible px-2 md:px-0"
                    >
                        {/* Enterprise Grade Auto-Detect Download Block */}
                        <OSDownloadBlock />
                    </motion.div>
                </div>

                {/* Premium System Status - Text Only, No Green Dot */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mb-12"
                >
                    <span className="font-mono text-[11px] text-neutral-600 tracking-[0.2em] uppercase">
                        Identra OS v1.0 • Secure Enclave Active
                    </span>
                </motion.div>

                {/* Divider - Static, Crisp, Premium */}
                <div className="w-full h-px bg-white/[0.1]" />

                {/* Footer Links - Expanding to Fill Width */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="w-full pt-10 flex flex-col md:flex-row justify-between items-center"
                >
                    {/* Copyright / Left */}
                    <span className="text-sm text-neutral-600 mb-6 md:mb-0">
                        © 2025 Identra Inc.
                    </span>

                    {/* Links - Widespread Spacing */}
                    <div className="flex gap-12 md:gap-16 items-center">
                        {[
                            { name: "Security", href: "/security" },
                            { name: "Privacy", href: "/privacy" },
                            { name: "Contact", href: "/contact" }
                        ].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm text-neutral-500 hover:text-white transition-colors duration-300 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
