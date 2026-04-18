"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Copy, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
    const [copied, setCopied] = useState(false);
    const email = "identrahq@gmail.com";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-black text-foreground relative overflow-hidden py-32 px-6">
            {/* Enterprise Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10 w-full mt-10">
                <Link href="/" className="inline-flex items-center text-xs font-mono tracking-widest uppercase text-neutral-500 hover:text-white transition-colors mb-20 group">
                    <ArrowLeft className="w-3.5 h-3.5 mr-3 transition-transform group-hover:-translate-x-1" />
                    Return to OS
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
                    {/* Left Column: Headers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            <span className="text-[10px] uppercase tracking-widest font-mono text-white/60">Secure Channel</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-8 leading-[0.9]">
                            Direct <br/> Connection.
                        </h1>
                        <p className="text-xl text-neutral-400 font-light leading-relaxed max-w-md">
                            For early access inquiries, enterprise deployment architecture, or security auditing requests, please initiate contact via our secure channel below.
                        </p>
                    </motion.div>

                    {/* Right Column: Interaction Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl backdrop-blur-md relative group overflow-hidden">
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-8">
                                    <Mail className="w-5 h-5 text-neutral-300" />
                                </div>
                                
                                <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 mb-2">Direct Email Address</p>
                                <a href={`mailto:${email}`} className="text-xl font-medium text-white hover:text-neutral-300 transition-colors inline-block mb-8 underline decoration-white/20 underline-offset-4 hover:decoration-white/60">
                                    {email}
                                </a>

                                <div className="h-px w-full bg-white/5 mb-8" />

                                <div className="flex gap-3">
                                    <button 
                                        onClick={copyToClipboard}
                                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors text-sm font-semibold"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Acquired</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Copy Address</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <a 
                                        href={`mailto:${email}`}
                                        className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white group/btn"
                                        aria-label="Open mail client"
                                    >
                                        <ExternalLink className="w-4 h-4 text-neutral-400 group-hover/btn:text-white transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-widest mt-6 text-center">
                            Typical response time: &lt; 24 Hours
                        </p>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}