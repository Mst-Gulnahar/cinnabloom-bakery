"use client";

import { motion } from "framer-motion";

interface SpinnerProps {
  label?: string;
  fullScreen?: boolean;
}

export default function CinnabloomSpinner({
  label = "Baking fresh treats...",
  fullScreen = false,
}: SpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      {/* Outer spinning ring with animated roll */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Soft glowing background pulse */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#D96B6B]/20 rounded-full blur-md"
        />

        {/* Dotted rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-[#D96B6B]/60 rounded-full"
        />

        {/* Cinnamon Roll Icon */}
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-3xl select-none relative z-10"
        >
          🍥
        </motion.div>
      </div>

      {/* Animated Label */}
      {label && (
        <p className="text-xs font-bold uppercase tracking-widest text-[#5A7A88] animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#D0E3EA]/30 backdrop-blur-[2px] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}