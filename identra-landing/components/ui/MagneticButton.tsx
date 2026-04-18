"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string; // Additional classes for the wrapper
    strength?: number; // How "strong" the magnet is (default 0.5)
}

export function MagneticButton({ children, className = "", strength = 0.5 }: MagneticButtonProps) {
    const magnetic = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!magnetic.current) return;

        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        let boundingRect: DOMRect | null = null;

        const mouseEnter = () => {
            if (magnetic.current) {
                boundingRect = magnetic.current.getBoundingClientRect();
            }
        };

        const mouseMove = (e: MouseEvent) => {
            if (!boundingRect) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = boundingRect;
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * strength);
            yTo(y * strength);
        };

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
            boundingRect = null; // Reset
        };

        const element = magnetic.current;
        element.addEventListener("mouseenter", mouseEnter);
        element.addEventListener("mousemove", mouseMove);
        element.addEventListener("mouseleave", mouseLeave);

        return () => {
            element.removeEventListener("mouseenter", mouseEnter);
            element.removeEventListener("mousemove", mouseMove);
            element.removeEventListener("mouseleave", mouseLeave);
        };
    }, [strength]);

    return (
        <div ref={magnetic} className={`inline-block ${className}`}>
            {children}
        </div>
    );
}
