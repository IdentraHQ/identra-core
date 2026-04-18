"use client";

import { useState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("email", email);

    const result = await joinWaitlist(formData);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("You're on the list. We'll be in touch.");
      setEmail("");
    }
  }

  return (
    <div className="w-full max-w-md relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-3 text-white bg-white/10 px-6 py-4 rounded-full border border-white/20 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-white/80" />
            <span className="text-sm font-medium">You're on the list. We'll be in touch.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="relative group"
          >
            {/* Animated Glow Backdrop */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/5 to-white/20 rounded-[2rem] md:rounded-full blur-md opacity-0 group-hover:opacity-30 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative flex md:items-center md:flex-row flex-col bg-white/[0.02] border border-white/10 group-hover:border-white/20 group-focus-within:border-white/30 group-focus-within:bg-white/[0.04] transition-all duration-500 rounded-[1.5rem] md:rounded-full p-1 md:p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md md:backdrop-blur-md md:backdrop-blur-xl">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email for early access..."
                className="w-full bg-transparent px-5 py-3.5 md:py-3.5 md:pl-5 md:pr-[140px] text-white placeholder-white/30 tracking-wide focus:outline-none focus:ring-0 text-sm rounded-[1.5rem] md:rounded-full"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="md:absolute right-1.5 px-6 py-3.5 md:py-0 rounded-[1rem] md:rounded-full bg-white text-black hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center font-medium text-sm md:h-[calc(100%-12px)] w-full md:w-auto mt-2 md:mt-0"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-1.5 opacity-70" />
                  </>
                )}
              </button>
            </div>
            
            {status === "error" && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-7 left-0 text-neutral-400 text-xs px-4"
              >
                {message}
              </motion.p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
