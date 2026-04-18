"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Command, Search, Sparkles, FileText, Code2, MessageSquare, Keyboard, Brain, Zap, Bot, ChevronDown, Check } from "lucide-react";
import { ShutterReveal } from "@/components/ui/ShutterReveal";

export function ProductExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const [mode, setMode] = useState<"invoke" | "ghost" | "console" | "recall">("invoke");
    const [activeModel, setActiveModel] = useState("Claude 3.5");

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest < 0.15) {
            setMode("invoke");
        } else if (latest < 0.3) {
            setMode("ghost");
        } else if (latest < 0.75) {
            setMode("console");
        } else {
            setMode("recall");
        }
    });

    // Main Workspace Window Animations
    const windowScale = useTransform(scrollYProgress, [0.25, 0.4], [0.95, 1]); // Reduced scale intensity
    const windowOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);

    // Sidebar animations
    const recallPanelX = useTransform(scrollYProgress, [0.75, 0.85], [10, 0]); // Subtle slide
    const recallPanelOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);

    const models = [
        { name: "Claude 3.5 Sonnet", icon: Brain, id: "claude" },
        { name: "Gemini 1.5 Pro", icon: Sparkles, id: "gemini" },
        { name: "GPT-4o", icon: Zap, id: "gpt" },
    ];

    return (
        <section ref={containerRef} className="relative h-[500vh] bg-background">
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-start pt-20 px-4 pb-8 gap-2">

                {/* Dynamic Ambient Background - Enhanced Visibility */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[100px] rounded-full mix-blend-screen"
                        animate={{
                            x: mode === "invoke" ? "-50%" : mode === "ghost" ? "-20%" : mode === "console" ? "-80%" : "-50%",
                            y: mode === "invoke" ? "-50%" : mode === "ghost" ? "-70%" : mode === "console" ? "-30%" : "-50%",
                            opacity: mode === "invoke" ? 0.3 : mode === "ghost" ? 0.4 : 0.15,
                            scale: mode === "invoke" ? 1 : 1.2
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[80px] rounded-full mix-blend-screen"
                        animate={{
                            x: mode === "invoke" ? "-50%" : "-50%",
                            y: mode === "invoke" ? "-50%" : "-50%",
                            opacity: mode === "invoke" ? 0.2 : 0,
                        }}
                        transition={{ duration: 1 }}
                    />
                </div>

                {/* Fixed Header Text Area - Increased Tracking & Line Height */}
                <div className="w-full max-w-xl px-4 text-center mb-4 relative z-20 h-24 shrink-0 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {(mode === "invoke" || mode === "ghost") && (
                            <motion.div
                                key="text-invoke"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute inset-0 flex flex-col items-center justify-center"
                            >
                                <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-3 tracking-wide">
                                    Instant Invocation
                                </h2>
                                <p className="text-muted-foreground/80 text-base leading-relaxed tracking-wide">
                                    Summon Identra via <span className="text-foreground font-medium">Win + K</span>. Always robust, never intrusive.
                                </p>
                            </motion.div>
                        )}
                        {mode === "console" && (
                            <motion.div
                                key="text-console"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute inset-0 flex flex-col items-center justify-center"
                            >
                                <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-3 tracking-wide">
                                    Deep Work Console
                                </h2>
                                <p className="text-muted-foreground/80 text-base leading-relaxed tracking-wide">
                                    Expands into a distraction-free environment where context is king.
                                </p>
                            </motion.div>
                        )}
                        {mode === "recall" && (
                            <motion.div
                                key="text-recall"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute inset-0 flex flex-col items-center justify-center"
                            >
                                <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-3 tracking-wide">
                                    Memory Recall
                                </h2>
                                <p className="text-muted-foreground/80 text-base leading-relaxed tracking-wide">
                                    Switch models instantly. Your context stays with you across Gemini, Claude, and GPT.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* VISUAL STAGE - WIDER (max-w-7xl) - with Shutter Reveal */}
                <ShutterReveal className="relative w-full max-w-7xl max-h-[60vh] md:max-h-[70vh] aspect-square md:aspect-[16/9] flex items-center justify-center shrink-1">

                    {/* 1. SHORTCUT CUE (Invoke State) */}
                    <AnimatePresence>
                        {mode === "invoke" && (
                            <div className="absolute z-30 flex flex-col items-center gap-8">
                                {/* Keys Container with Radial Glow */}
                                <motion.div
                                    key="keys"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="relative"
                                >
                                    {/* Intensified static glow */}
                                    <div className="absolute inset-0 -z-10 bg-primary/40 blur-[80px] rounded-full opacity-80 scale-150" />

                                    <div className="flex items-center gap-2 sm:gap-4 scale-75 md:scale-100">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
                                            <svg className="w-10 h-10 text-foreground/80" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M0 3.449L9.75 4.823V11.5h-9.75V3.449zm10.504 1.309l12.748 1.733V11.5H10.504V4.758zM0 12.25h9.75v8.051L0 21.551V12.25zm10.504 0h12.748v6.793l-12.748 1.733V12.25z" />
                                            </svg>
                                        </div>
                                        <span className="text-2xl text-muted-foreground/50 font-light">+</span>
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
                                            <span className="text-4xl font-sans font-medium text-foreground/90">K</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Staggered Input Text */}
                                <motion.p
                                    key="instruction"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, delay: 0.15 }} // 150ms delay
                                    className="text-sm font-mono text-muted-foreground/70 tracking-widest uppercase"
                                >
                                    Press to invoke
                                </motion.p>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* 2. GHOST OVERLAY (Ghost State) */}
                    <motion.div
                        className="absolute z-20 w-full max-w-xl"
                        style={{ opacity: mode === "ghost" ? 1 : 0, pointerEvents: mode === "ghost" ? "auto" : "none" }}
                        animate={{
                            scale: mode === "ghost" ? 1 : mode === "invoke" ? 0.98 : 1.02, // Subtle scale
                            y: mode === "ghost" ? 0 : 20
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="bg-[#141416]/95 backdrop-blur-md md:backdrop-blur-md md:backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 overflow-hidden ring-1 ring-white/5 mx-4 md:mx-0">
                            <div className="flex items-center gap-4 text-xl text-muted-foreground mb-6">
                                <Command className="w-6 h-6 shrink-0 opacity-70" />
                                <span className="whitespace-nowrap opacity-90">Ask Identra...</span>
                                <span className="ml-auto text-xs px-2 py-1 rounded bg-white/5 border border-white/10 shrink-0 font-mono opacity-60">⏎</span>
                            </div>
                            <div className="h-px w-full bg-white/5 mb-4" />
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-3 bg-primary/5 text-primary rounded-lg text-base whitespace-nowrap overflow-hidden border border-primary/10">
                                    <Sparkles className="w-5 h-5 shrink-0" />
                                    <span className="truncate">Summarize last meeting notes</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 hover:bg-white/5 text-muted-foreground rounded-lg text-base transition-colors whitespace-nowrap overflow-hidden">
                                    <Search className="w-5 h-5 shrink-0 opacity-70" />
                                    <span className="truncate opacity-80">Search for "Authentication"</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* 3. MAIN WORKSPACE WINDOW */}
                    <motion.div
                        className="relative w-full h-full bg-[#0A0A0B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                        style={{
                            scale: windowScale,
                            opacity: windowOpacity
                        }}
                    >
                        {/* OS Title Bar - Dimmed */}
                        <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-6 justify-between select-none shrink-0">
                            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
                                <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
                                <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
                            </div>
                            <div className="text-xs text-muted-foreground/30 font-mono tracking-widest">IDENTRA OS</div>
                            <div className="w-16" />
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 relative flex overflow-hidden">

                            {/* Left Sidebar */}
                            <motion.div
                                className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col p-6 gap-6 hidden lg:flex shrink-0 z-10"
                            >
                                {/* RECENT Section */}
                                <div className="flex flex-col gap-2">
                                    <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest mb-2 shrink-0">Recent</div>
                                    <div className="space-y-1">
                                        {[
                                            { icon: MessageSquare, label: "Project Alpha" },
                                            { icon: Code2, label: "API Integration" },
                                            { icon: FileText, label: "Q4 Report" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground/60 p-2.5 rounded-lg hover:bg-white/5 cursor-default transition-colors whitespace-nowrap overflow-hidden group">
                                                <item.icon className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                <span className="group-hover:text-foreground transition-colors">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px w-full bg-white/5 my-2" />

                                {/* MODEL SWITCHER Section */}
                                <div className="flex flex-col gap-2">
                                    <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest mb-2 shrink-0">Reasoning Engine</div>
                                    <div className="space-y-1">
                                        {models.map((model) => (
                                            <div
                                                key={model.id}
                                                className={`flex items-center gap-3 text-sm p-2.5 rounded-lg cursor-pointer transition-all ${activeModel === model.name
                                                    ? "bg-white/5 text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                                                    : "text-muted-foreground/50 hover:bg-white/[0.02] hover:text-foreground/80"
                                                    }`}
                                                onClick={() => setActiveModel(model.name)}
                                            >
                                                <model.icon className={`w-4 h-4 shrink-0 ${activeModel === model.name ? "text-foreground" : "opacity-40"}`} />
                                                <span className="flex-1 truncate tracking-tight">{model.name}</span>
                                                {activeModel === model.name && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Center Stage - Console Content */}
                            <motion.div
                                className="flex-1 flex flex-col relative min-w-0 bg-background/50 z-0"
                                animate={{ opacity: mode === "recall" ? 0.3 : 1, filter: mode === "recall" ? "blur(1px)" : "blur(0px)" }} // Dim during recall
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex-1 p-8 md:p-12 overflow-hidden flex flex-col justify-center">
                                    <div className="space-y-8 w-full max-w-3xl mx-auto">
                                        {/* User Message - More subtle */}
                                        <div className="flex gap-6 opacity-70">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0" />
                                            <div className="space-y-3 flex-1 pt-1">
                                                <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                                                <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                                            </div>
                                        </div>
                                        {/* AI Response - Reduced Prominence */}
                                        <div className="flex gap-6 flex-row-reverse">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0 border border-white/5" />
                                            <div className="space-y-3 flex-1 min-w-0 max-w-[85%]">
                                                <div className="p-6 bg-transparent border border-white/10 rounded-2xl text-base text-foreground/80 leading-relaxed shadow-none break-words">
                                                    Based on your previous architecture documents, I've analyzed the auth flow using <span className="font-medium text-foreground">{activeModel}</span>. The proposed changes align with our security standards.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Bar */}
                                <div className="p-6 border-t border-white/5 bg-white/[0.01] shrink-0">
                                    <div className="max-w-3xl mx-auto w-full bg-white/5 border border-white/5 rounded-xl h-14 flex items-center px-6 text-muted-foreground/30 text-base truncate shadow-none justify-between transition-colors hover:bg-white/[0.07] hover:border-white/10">
                                        <span>Type a message to Identra...</span>
                                        <div className="flex items-center gap-2 opacity-50">
                                            <Keyboard className="w-4 h-4" />
                                            <span className="text-xs font-mono">Win+K</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Panel (Recall) - Professional Monochromatic Context with Highlight */}
                            <motion.div
                                className="w-72 border-l border-white/5 bg-white/[0.02] flex flex-col p-6 hidden xl:flex shrink-0 z-10"
                                style={{ x: recallPanelX, opacity: recallPanelOpacity }}
                            >
                                <div className="flex items-center gap-3 text-[10px] font-semibold text-primary/80 uppercase tracking-widest mb-6 shrink-0">
                                    <Brain className="w-4 h-4" />
                                    <span>Model Context</span>
                                </div>

                                <div className="space-y-4 overflow-y-auto pr-2">
                                    {[
                                        {
                                            title: "Auth_Specs_v2.pdf",
                                            model: "Claude 3.5",
                                            icon: Brain
                                        },
                                        {
                                            title: "Security_Audit_2024",
                                            model: "Gemini 1.5",
                                            icon: Sparkles
                                        },
                                        {
                                            title: "Client Meeting Analysis",
                                            model: "GPT-4o",
                                            icon: Zap
                                        },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * i }}
                                            className="relative p-4 bg-white/[0.03] border border-white/5 rounded-xl cursor-default group overflow-hidden"
                                        >
                                            {/* Soft Glow/Halo on Hover or Active - Simulated for demo */}
                                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex items-center justify-between mb-2 relative z-10">
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border border-white/5 bg-white/[0.02] text-muted-foreground/70 group-hover:text-foreground/90 group-hover:bg-white/5 transition-all">
                                                    <item.icon className="w-3 h-3" />
                                                    <span>{item.model}</span>
                                                </div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/60 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all"></div>
                                            </div>
                                            <div className="text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors truncate relative z-10">
                                                {item.title}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 shrink-0">
                                    <div className="text-[10px] text-muted-foreground/30 text-center tracking-wide font-mono">
                                        CROSS-MODEL SYNC ACTIVE
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>
                </ShutterReveal>

                {/* Footer text - Consistent */}
                <motion.div
                    className="absolute bottom-6 md:bottom-8 text-center text-xs text-muted-foreground/30 font-mono tracking-widest uppercase"
                    animate={{ opacity: mode === "invoke" ? 0 : 1 }}
                >
                    Identra OS v1.0 • Secure Enclave Active
                </motion.div>

            </div>
        </section >
    );
}
