"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for subtle border effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={`fixed top-0 left-0 right-0 z-[100] px-6 py-4 pointer-events-none transition-colors duration-500 ${
                scrolled ? "bg-black/50 backdrop-blur-xl border-b border-white/5" : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto pointer-events-auto">
                {/* Minimalist Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/20 rounded rotate-0 transition-transform group-hover:rotate-45 duration-500" />
                        <div className="absolute inset-[3px] bg-white/50 rounded-sm rotate-45 transition-transform group-hover:rotate-90 duration-500" />
                        <div className="absolute inset-[5px] bg-white rounded-[2px] rotate-0 transition-transform group-hover:rotate-180 duration-700 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>
                    <span className="font-display font-medium text-sm tracking-widest text-white uppercase mt-0.5">IDENTRA</span>
                </div>
            </div>
        </motion.header>
    );
}
