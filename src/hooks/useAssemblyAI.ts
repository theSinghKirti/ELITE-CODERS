import { useState, useRef, useEffect } from "react";

interface UseAssemblyAIProps {
  onFinalTranscript?: (text: string) => void;
  onPartialTranscript?: (text: string) => void;
}

export function useAssemblyAI({ onFinalTranscript, onPartialTranscript }: UseAssemblyAIProps = {}) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [finalTranscript, setFinalTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Helper safe float32 to int16 PCM converter
  const convertFloat32ToInt16 = (buffer: Float32Array): Int16Array => {
    const l = buffer.length;
    const buf = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      buf[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return buf;
  };

  // Safe chunked base64 encoder
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Fallback simulator for keys missing or offline flow
  const startMockSimulation = () => {
    setIsConnected(true);
    setLiveTranscript("You: Preparing voice channel...");
    
    const phrases = [
      "I am having some fever...",
      "fever with throbbing headache",
      "fever with throbbing headache behind my right eye..."
    ];
    let counter = 0;

    mockIntervalRef.current = setInterval(() => {
      if (counter < phrases.length) {
        const text = phrases[counter];
        setLiveTranscript(`You: ${text}`);
        if (onPartialTranscript) onPartialTranscript(text);
        counter++;
      } else {
        stopMockSimulation();
        const finalText = "I have had a severe throbbing headache behind my right eye for 3 days and some mild fever.";
        setLiveTranscript("");
        setFinalTranscript(finalText);
        if (onFinalTranscript) onFinalTranscript(finalText);
      }
    }, 1500);
  };

  const stopMockSimulation = () => {
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
  };

  const startListening = async () => {
    setError(null);
    setLiveTranscript("");
    setFinalTranscript("");
    setIsRecording(true);

    try {
      // 1. Grab assembly token from server-side proxy
      const res = await fetch("/api/assemblyai-token");
      if (!res.ok) {
        throw new Error(`Failed to initialize session tokens: ${res.statusText}`);
      }
      const data = await res.json();
      
      if (data.isMock) {
        // Safe mock fallback
        startMockSimulation();
        return;
      }

      const token = data.token;

      // 2. Request mic permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect AssemblyAI WebSocket stream
      const websocketUrl = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`;
      const ws = new WebSocket(websocketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.message_type === "SessionBegins") {
            setIsConnected(true);
          } else if (response.message_type === "PartialTranscript") {
            setLiveTranscript(response.text);
            if (onPartialTranscript) onPartialTranscript(response.text);
          } else if (response.message_type === "FinalTranscript") {
            setLiveTranscript("");
            setFinalTranscript(response.text);
            if (onFinalTranscript) onFinalTranscript(response.text);
          }
        } catch (e) {
          console.error("Error parsing websocket content:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("AssemblyAI network websocket error:", err);
        setError("AssemblyAI network connection failure. Retrying...");
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      // 4. Setup AudioContext + ScriptProcessor resampling mono down to 16000Hz standard PCM
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Buffer = convertFloat32ToInt16(inputData);
        const base64Audio = arrayBufferToBase64(int16Buffer.buffer);
        ws.send(JSON.stringify({ audio_data: base64Audio }));
      };

    } catch (err: any) {
      console.error("Failed starting secure voice streaming pipeline:", err);
      setError(err.message || "Microphone access denied. Please grant permission in browser preferences.");
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    setIsRecording(false);
    setIsConnected(false);
    stopMockSimulation();

    // Close and clean up media audio sources
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ terminate_session: true }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Clean elements on unmount safely
  useEffect(() => {
    return () => {
      stopMockSimulation();
      if (wsRef.current) wsRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    isConnected,
    isRecording,
    liveTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    analyserNode: analyserRef.current,
  };
}
