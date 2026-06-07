import { useState, useEffect, useRef } from "react";
import { useAssemblyAI } from "./useAssemblyAI";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface UseVoiceConsultationProps {
  doctorType: string;
  initialSymptoms?: string;
  onAIResponseCompleted?: (text: string) => void;
}

export function useVoiceConsultation({
  doctorType,
  initialSymptoms = "",
  onAIResponseCompleted,
}: UseVoiceConsultationProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-user",
      role: "user",
      content: initialSymptoms || "Hi, I have a sudden tightness in my chest and feel a bit lightheaded.",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "init-ai",
      role: "assistant",
      content: `I understand you're dealing with a persistent chest tightness and lightheadedness. This is concerning and I'd like to ask a few more questions. Medical disclaimer: I'm an AI assistant — always consult a real doctor. How long has this chest tightness been occurring?`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize internal AssemblyAI triggers
  const {
    isConnected,
    isRecording,
    liveTranscript,
    finalTranscript,
    error: sttError,
    startListening,
    stopListening,
    analyserNode,
  } = useAssemblyAI({
    onFinalTranscript: (text) => {
      handleUserSpeechFinal(text);
    },
  });

  // Track websocket and mic errors
  useEffect(() => {
    if (sttError) {
      setGlobalError(sttError);
    }
  }, [sttError]);

  // Clean local speaking audio resources safely on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    };
  }, []);

  const stopAudioPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setIsSpeaking(false);
  };

  // Convert floats to time readable string formatting
  const getFormattedTime = () => {
    return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // Triggered when AssemblyAI finalizes human spoken sentence
  const handleUserSpeechFinal = async (spokenText: string) => {
    if (!spokenText.trim() || isMuted) return;

    // 1. Terminate current speaking flow
    stopAudioPlayback();

    // 2. Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: spokenText,
      timestamp: getFormattedTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsProcessing(true);
    setGlobalError(null);

    try {
      // 3. Initiate call to streaming Chat endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          doctorType,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat api failed to respond.");
      }

      // 4. Create placeholder AI message
      const aiMsgId = crypto.randomUUID();
      const aiPlaceholder: Message = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, aiPlaceholder]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to read stream thread.");

      const decoder = new TextDecoder();
      let fullContent = "";
      let partialBuffer = "";

      setIsProcessing(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialBuffer += decoder.decode(value, { stream: true });
        const lines = partialBuffer.split("\n");
        partialBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const bodyStr = trimmed.slice(6).trim();

          if (bodyStr === "[DONE]") {
            break;
          }

          try {
            const parsed = JSON.parse(bodyStr);
            if (parsed.text) {
              fullContent += parsed.text;
              
              // Incrementally update current bubble
              setMessages((prev) =>
                prev.map((m) => (m.id === aiMsgId ? { ...m, content: fullContent } : m))
              );
            }
          } catch (e) {
            // Ignore parse line glitches
          }
        }
      }

      // 5. Speak out the streaming output via TTS API
      await triggerTextToSpeech(fullContent);

      if (onAIResponseCompleted) {
        onAIResponseCompleted(fullContent);
      }

    } catch (err: any) {
      console.error("Pipeline failure in transcription stream cycle:", err);
      setGlobalError(err.message || "Diagnostic channel failed. Please speak again.");
      setIsProcessing(false);
    }
  };

  // Convert streaming AI answers to TTS audio
  const triggerTextToSpeech = async (text: string) => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("TTS generation request failed.");
      }

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        // Key missing mock response fallback simulation
        const data = await response.json();
        if (data.mock) {
          simulateMouthSpeakingFeedback(text);
          return;
        }
      }

      // Convert buffer stream directly to local audio playback source
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioPlayerRef.current = audio;

      setIsSpeaking(true);
      await audio.play();

      audio.onended = () => {
        setIsSpeaking(false);
      };
    } catch (err) {
      console.error("Unable to execute TTS playback. Fallback speaking simulation enabled.", err);
      simulateMouthSpeakingFeedback(text);
    }
  };

  // Simple safe fallback speech cycle feedback simulation
  const simulateMouthSpeakingFeedback = (text: string) => {
    setIsSpeaking(true);
    // Rough estimate: 120 words per minute speaking speed
    const words = text.split(" ").length;
    const estimatedDurationMs = Math.max(2500, (words / 120) * 60 * 1000);

    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    speechIntervalRef.current = setTimeout(() => {
      setIsSpeaking(false);
    }, estimatedDurationMs);
  };

  const startConsultation = () => {
    if (isMuted) return;
    startListening();
  };

  const stopConsultation = () => {
    stopListening();
    stopAudioPlayback();
  };

  const toggleMute = () => {
    if (!isMuted) {
      // Mute microphone
      stopListening();
      setIsMuted(true);
    } else {
      // Unmute microphone
      setIsMuted(false);
    }
  };

  return {
    messages,
    isListening: isRecording,
    isProcessing,
    isSpeaking,
    isMuted,
    liveTranscript,
    error: globalError,
    startConsultation,
    stopConsultation,
    toggleMute,
    analyserNode,
  };
}
