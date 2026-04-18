"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-8">Privacy Policy</h1>
                    <p className="text-xl text-neutral-400 font-light mb-16 leading-relaxed">
                        We don't want your data. Identra is engineered precisely to ensure that your workflow stays private by design.
                    </p>

                    <div className="space-y-12">
                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">1. Data Collection</h2>
                            <p className="text-neutral-500 leading-relaxed mb-4">
                                We collect the absolute bare minimum data required to deliver critical updates and ensure your software license is valid. This includes:
                            </p>
                            <ul className="list-disc list-inside text-neutral-500 space-y-2 ml-4">
                                <li>The email address provided for early access / account creation.</li>
                                <li>Basic, anonymized crash reports (opt-in only).</li>
                                <li>Billing information processed directly via our secure payment partners.</li>
                            </ul>
                        </section>

                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">2. What We Never Do</h2>
                            <p className="text-neutral-500 leading-relaxed">
                                We will never access, parse, index, or sell the contents of your OS interactions, documents, or queries. Identra does not utilize your usage payload to train global models. Your memory vault is exclusively yours.
                            </p>
                        </section>

                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">3. Data Retention</h2>
                            <p className="text-neutral-500 leading-relaxed">
                                Account metadata is retained strictly for the duration of your active subscription. Upon deletion, all associated telemetry and records are definitively purged from our systems within 14 days.
                            </p>
                        </section>

                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-2xl font-medium mb-4">4. Early Access & Communications</h2>
                            <p className="text-neutral-500 leading-relaxed">
                                By joining the waitlist, you consent to receive periodic updates regarding access drops and product developments. Every communication contains a frictionless, one-click opt-out.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}