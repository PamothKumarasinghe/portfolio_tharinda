"use client";

import { useEffect, useRef } from "react";

export default function ElectricThunder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    // Handle resizing to keep the canvas full screen
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    window.addEventListener("resize", resize);
    resize();

    interface Lightning {
      path: { x: number; y: number }[];
      alpha: number;
    }
    let lightnings: Lightning[] = [];

    // Function to generate a random lightning path
    function createLightning() {
      if (!canvas) return;
      const startX = Math.random() * canvas.width;
      const lightning = {
        path: [{ x: startX, y: 0 }],
        alpha: 1,
      };

      let currentX = startX;
      let currentY = 0;

      // Draw the zig-zag path downwards
      while (currentY < canvas.height) {
        currentX += (Math.random() - 0.5) * 60; // Spread of the zig-zag
        currentY += Math.random() * 40 + 10;    // Downward reach
        lightning.path.push({ x: currentX, y: currentY });
      }
      lightnings.push(lightning);
    }

    // Main animation loop
    function draw() {
      if (!ctx || !canvas) return;
      // Create the dark background with a slight fade to leave "trails"
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Random chance to trigger a lightning strike (adjust for frequency)
      if (Math.random() < 0.015) { 
         createLightning();
         // Ambient screen flash effect
         ctx.fillStyle = "rgba(200, 220, 255, 0.4)";
         ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw and animate existing lightning bolts
      for (let i = lightnings.length - 1; i >= 0; i--) {
        const l = lightnings[i];
        
        ctx.beginPath();
        ctx.moveTo(l.path[0].x, l.path[0].y);
        for (let j = 1; j < l.path.length; j++) {
          ctx.lineTo(l.path[j].x, l.path[j].y);
        }

        // Lightning styling (Neon Blue Glow)
        ctx.strokeStyle = `rgba(150, 200, 255, ${l.alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(100, 150, 255, 1)";
        ctx.stroke();

        // Reset shadow for the background fill
        ctx.shadowBlur = 0;

        // Fade out the bolt over time
        l.alpha -= 0.04; 
        if (l.alpha <= 0) {
          lightnings.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // Tailwind classes to make it an absolute background overlay that doesn't block clicks
      className="pointer-events-none absolute inset-0 w-full h-full bg-black"
    />
  );
}
