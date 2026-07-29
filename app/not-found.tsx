"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-[#3E3835] flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url('/images/bg.png')`,
        backgroundColor: "#D0E3EA",
      }}
    >
      {/* Soft overlay blur */}
      <div className="absolute inset-0 bg-[#D0E3EA]/40 backdrop-blur-[2px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E5E0D8] rounded-3xl p-8 shadow-xl text-center relative z-10 space-y-6"
      >
        {/* Animated Cinnamon Roll 404 Illustration */}
        <div className="relative flex justify-center items-center py-2">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl select-none"
          >
            🍥
          </motion.div>
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-1 right-1/4 bg-[#D96B6B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-widest uppercase"
          >
            404 Lost
          </motion.span>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#3E3835]">
            Oops! This crumb strayed off.
          </h1>
          <p className="text-xs text-[#7A736E] leading-relaxed max-w-xs mx-auto">
            The page or pastry you are looking for has been eaten or moved to a different tray!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 px-4 py-3 bg-[#D96B6B] hover:bg-[#C25858] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={14} /> Back Home
          </Link>

          <Link
            href="/menu"
            className="flex-1 px-4 py-3 bg-[#FFFDF9] hover:bg-white border border-[#E5E0D8] text-[#3E3835] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass size={14} /> View Menu
          </Link>
        </div>

        {/* Return link */}
        <div className="pt-2">
          <button
            onClick={() => window.history.back()}
            className="text-[11px] font-semibold text-[#7A736E] hover:text-[#3E3835] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft size={12} /> Go back to previous page
          </button>
        </div>
      </motion.div>
    </main>
  );
}