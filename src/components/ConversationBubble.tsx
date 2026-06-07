import React from "react";
import { motion } from "motion/react";
import { Stethoscope, User } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConversationBubbleProps {
  key?: any;
  message: Message;
  doctorName?: string;
}

export function ConversationBubble({ message, doctorName = "Dr. General" }: ConversationBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className={`flex items-start gap-3 w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Doctor/Assistant Avatar on the left */}
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-teal/15 dark:bg-teal/20 border border-teal/20 flex items-center justify-center text-teal shrink-0">
          <Stethoscope className="h-4 w-4" />
        </div>
      )}

      {/* Message Balloon */}
      <div className="max-w-[80%] sm:max-w-[70%] space-y-1">
        <div
          className={`px-4 py-3 text-xs leading-relaxed font-sans font-medium rounded-2xl ${
            isUser
              ? "bg-teal text-white rounded-tr-none text-right font-medium"
              : "bg-slate-800 dark:bg-slate-800/80 text-slate-100 rounded-tl-none text-left"
          }`}
        >
          {message.content}
        </div>
        
        {/* Attribution / Timestamp */}
        <div className={`text-[9px] font-bold text-slate-500 uppercase tracking-tight ${isUser ? "text-right" : "text-left"}`}>
          {isUser ? "You" : doctorName} • {message.timestamp}
        </div>
      </div>

      {/* User Avatar on right */}
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}
