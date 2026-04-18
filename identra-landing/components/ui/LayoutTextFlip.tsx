"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LayoutTextFlip({
  text,
  words,
  className,
  wordClassName,
}: {
  text?: string;
  words: string[];
  className?: string;
  wordClassName?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000); 

    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className={cn("flex flex-col md:flex-row md:items-center md:flex-wrap", className)}>
      {text && <span className="md:mr-4">{text}</span>}
      <span className="relative flex overflow-hidden lg:h-[1.2em] items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn("inline-block text-white", wordClassName)}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
