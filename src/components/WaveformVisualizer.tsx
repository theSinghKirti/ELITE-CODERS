import React, { useRef, useEffect } from "react";

interface WaveformVisualizerProps {
  status: "idle" | "listening" | "processing" | "speaking";
  analyserNode?: AnalyserNode | null;
}

export function WaveformVisualizer({ status, analyserNode }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const barCount = 42;
    const bars: { x: number; height: number; targetHeight: number }[] = [];

    // Initialize bars
    for (let i = 0; i < barCount; i++) {
      bars.push({
        x: 0,
        height: 6,
        targetHeight: 6,
      });
    }

    let phase = 0;

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const spacing = 4;
      const totalSpacing = spacing * (barCount - 1);
      const barWidth = (width - totalSpacing) / barCount;

      phase += 0.05;

      // Extract raw audio buffer byte amplitudes if real web-audio is active
      let dataArray = new Uint8Array(0);
      if (analyserNode && status === "listening") {
        const bufferLength = analyserNode.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);
      }

      // Update and draw bars
      for (let i = 0; i < barCount; i++) {
        const bar = bars[i];
        
        if (analyserNode && status === "listening" && dataArray.length > 0) {
          // Extract matching segment amplitude from the live signal array
          const segmentIndex = Math.floor((i / barCount) * dataArray.length);
          const sampleValue = dataArray[segmentIndex];
          // Normalize [-1.0, 1.0] centering 128 as silence reference level
          const normalized = (sampleValue - 128) / 128;
          const amplitude = Math.abs(normalized);
          
          // Magnify response for cleaner visual feedback rendering 
          bar.targetHeight = Math.max(6, amplitude * height * 1.5 + 4);
        } else if (status === "listening") {
          // Quick audio input simulation with high frequency variations
          if (Math.random() > 0.4) {
            bar.targetHeight = Math.floor(Math.random() * (height * 0.75)) + 12;
          }
        } else if (status === "speaking") {
          // Harmonic wave motion for speech
          const offset = i * 0.25;
          const configHeight = (Math.sin(phase * 1.5 + offset) + 1) / 2;
          bar.targetHeight = configHeight * (height * 0.65) + 10;
        } else if (status === "processing") {
          // Gentle swift wave rolling
          const offset = i * 0.15;
          const configHeight = (Math.sin(phase * 4 + offset) + 1) / 2;
          bar.targetHeight = configHeight * (height * 0.25) + 5;
        } else {
          // Idle breathing sine wave
          const offset = i * 0.1;
          const configHeight = (Math.sin(phase * 0.8 + offset) + 1) / 2;
          bar.targetHeight = configHeight * 12 + 6;
        }

        // Smooth height transition
        bar.height += (bar.targetHeight - bar.height) * 0.22;

        const x = i * (barWidth + spacing);
        const y = (height - bar.height) / 2;

        // Visual design: high-contrast teal with subtle gradient styling
        const gradient = ctx.createLinearGradient(x, y, x, y + bar.height);
        if (status === "listening") {
          gradient.addColorStop(0, "#29f3db");
          gradient.addColorStop(1, "#0d9488");
        } else if (status === "speaking") {
          gradient.addColorStop(0, "#34d399");
          gradient.addColorStop(1, "#059669");
        } else {
          gradient.addColorStop(0, "#14b8a6");
          gradient.addColorStop(1, "#115e59");
        }

        ctx.fillStyle = gradient;
        
        // Draw rounded bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, bar.height, 4);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // Responsive Canvas Resize logic
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || 360;
        canvas.height = 120;
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [status, analyserNode]);

  return (
    <div className="w-full flex justify-center items-center py-4 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-4">
      <canvas ref={canvasRef} className="block w-full" height={120} />
    </div>
  );
}
