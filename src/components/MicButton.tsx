import React from "react";
import { Mic, MicOff } from "lucide-react";
import { motion } from "motion/react";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export function MicButton({ isListening, onClick }: MicButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Dynamic Animated Pulse Ring */}
      {isListening && (
        <motion.div
          animate={{
            scale: [1, 1.35],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute h-20 w-20 rounded-full bg-teal/30 z-0"
        />
      )}

      {/* Button Body wrapper */}
      <button
        onClick={onClick}
        className={`relative z-10 h-16 w-16 sm:h-18 sm:w-18 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${
          isListening
            ? "bg-teal text-white hover:bg-teal-600 shadow-teal-500/20"
            : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
        }`}
      >
        {isListening ? (
          <Mic className="h-6 w-6 sm:h-7 sm:w-7 animate-pulse" />
        ) : (
          <MicOff className="h-6 w-6 sm:h-7 sm:w-7" />
        )}
      </button>
    </div>
  );
}
