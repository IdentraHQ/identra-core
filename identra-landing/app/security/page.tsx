"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden py-32 px-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto relative z-10 w-full">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors mb-16 group">
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to system
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-8">Security Architecture</h1>
                    <p className="text-xl text-neutral-400 font-light mb-16 leading-relaxed">
                        At Identra, security isn't a feature—it's the foundation. Our architecture guarantees that your data never leaves your environment unencrypted.
                    </p>

                    <div className="space-y-12">
                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">Local-First Enforcement</h2>
                            <p className="text-neutral-500 leading-relaxed">
                                Our models and processing occur directly on your hardware. By bypassing the cloud entirely for core reasoning tasks, your proprietary context is never subject to data transport vulnerabilities or server-side breaches.
                            </p>
                        </section>

                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">Zero-Knowledge Cloud Sync</h2>
                            <p className="text-neutral-500 leading-relaxed">
                                If you enable multi-device sync, everything is end-to-end encrypted (E2EE) before it leaves your machine. We hold zero keys. Our servers only ever "see" mathematical noise.
                            </p>
                        </section>

                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">Ephemeral Memory & Purge</h2>
                            <p className="text-neutral-500 leading-relaxed">
                                You control what Identra remembers. Memory allocation is totally transparent, and a complete or partial purge is accessible via a single cryptographically secure command.
                            </p>
                        </section>
                        
                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">Auditable Transparency</h2>
                            <p className="text-neutral-500 leading-relaxed">
                                Our security codebase is subjected to ongoing third-party audits and adversarial testing protocols to maintain defense-in-depth against emerging threat models.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}