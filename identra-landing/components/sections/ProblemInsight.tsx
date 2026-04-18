"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const STATEMENTS = [
    "AI tools forget context.",
    "Switching tabs breaks focus.",
    "Cloud-first systems expose sensitive work.",
    "AI needs an operating layer — not another window.",
];

export function ProblemInsight() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Subtle background vignette that lightens slightly as we progress through statements
    const backgroundLightness = useTransform(scrollYProgress, [0, 1], [0, 0.02]);

    // Simple fade transition (removed heavy blur filter for performance)
    const contentOpacity = useTransform(scrollYProgress, [0.90, 1], [1, 0]);
    const scale = useTransform(scrollYProgress, [0.90, 1], [1, 0.95]);
    const y = useTransform(scrollYProgress, [0.90, 1], [0, -20]);

    return (
        <section id="problem-section" ref={containerRef} className="relative h-[300vh] bg-transparent z-10 w-full">
            {/* Subtle grain texture for depth */}
            {/* Grain disabled/simplified to reduce scroll lag */}
            <div
                className="absolute inset-0 opacity-[0.01] pointer-events-none md:mix-blend-overlay hidden md:block"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Dynamic background vignette */}


            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <motion.div style={{ opacity: contentOpacity, scale, y }} className="relative w-full text-center h-full flex items-center justify-center">
                    {STATEMENTS.map((text, i) => (
                        <Statement
                            key={i}
                            text={text}
                            index={i}
                            total={STATEMENTS.length}
                            progress={scrollYProgress}
                        />
                    ))}
                </motion.div>
            </div>
        </section >
    );
}

function Statement({
    text,
    index,
    total,
    progress,
}: {
    text: string;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    const start = index / total;
    const end = (index + 1) / total;

    const isLast = index === total - 1;
    const isProblem = index < total - 1; // First 3 are problems, last is insight

    // Smooth fade transitions only - no sliding
    const opacity = useTransform(
        progress,
        isLast
            ? [start, start + 0.15, end - 0.05, end]
            : [start, start + 0.15, end - 0.15, end],
        isLast
            ? [0, 1, 1, 0] // Final statement fades out for transition
            : [0, 1, 1, 0]
    );

    // Remove scale animation for cleaner editorial feel

    return (
        <motion.div
            style={{ opacity }}
            className="absolute inset-0 flex items-center justify-center p-6 w-full h-full pointer-events-none"
        >
            <h2
                className={`font-display tracking-tight text-foreground leading-tight text-center max-w-4xl px-4 transition-all ${isLast
                    ? 'text-4xl md:text-5xl lg:text-6xl font-semibold' // Final insight: larger, heavier
                    : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal opacity-90' // Problems: lighter weight, slightly lower opacity
                    }`}
            >
                {text}
            </h2>
        </motion.div>
    );
}
