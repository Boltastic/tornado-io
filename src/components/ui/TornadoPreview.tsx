import React, { useEffect, useRef } from 'react';
import { SkinAura } from '../../types';

interface TornadoPreviewProps {
  aura?: SkinAura;
  primaryColor?: string;
  secondaryColor?: string;
  particleColor?: string;
  glowColor?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const TornadoPreview: React.FC<TornadoPreviewProps> = ({
  aura = 'classic',
  primaryColor = '#06b6d4',
  secondaryColor = '#3b82f6',
  particleColor = '#93c5fd',
  glowColor = '#22d3ee',
  size = 'md',
  interactive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const containerSizes = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48 md:w-56 md:h-56',
    lg: 'w-64 h-64 md:w-72 md:h-72',
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Create particles
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }).map(() => ({
      yRatio: Math.random(), // 0 (bottom) to 1 (top)
      angle: Math.random() * Math.PI * 2,
      orbitRadiusRatio: 0.2 + Math.random() * 0.8,
      speed: 0.03 + Math.random() * 0.05,
      size: 2 + Math.random() * 3,
    }));

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      angle += 0.04;

      // Draw Outer Glow Ring
      const gradientGlow = ctx.createRadialGradient(
        centerX,
        centerY + height * 0.1,
        10,
        centerX,
        centerY,
        width * 0.45
      );
      gradientGlow.addColorStop(0, glowColor + '66');
      gradientGlow.addColorStop(0.6, primaryColor + '22');
      gradientGlow.addColorStop(1, 'transparent');

      ctx.fillStyle = gradientGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Draw Tornado Funnel Layers (bottom narrow, top wide)
      const layers = 16;
      for (let i = 0; i < layers; i++) {
        const progress = i / (layers - 1); // 0 at bottom, 1 at top
        const layerY = centerY + height * 0.35 - progress * height * 0.65;
        const layerRadius = width * (0.05 + progress * 0.32);

        const swirlOffset = Math.sin(angle * 2 + progress * 4) * (width * 0.03);

        ctx.save();
        ctx.translate(centerX + swirlOffset, layerY);

        // Draw Swirling Oval Band
        ctx.beginPath();
        ctx.ellipse(0, 0, layerRadius, layerRadius * 0.35, angle * 1.5 + progress * 2, 0, Math.PI * 2);

        const bandGrad = ctx.createLinearGradient(-layerRadius, 0, layerRadius, 0);
        bandGrad.addColorStop(0, primaryColor);
        bandGrad.addColorStop(0.5, secondaryColor);
        bandGrad.addColorStop(1, glowColor);

        ctx.strokeStyle = bandGrad;
        ctx.lineWidth = 3 + progress * 2;
        ctx.globalAlpha = 0.5 + Math.sin(angle + progress * 3) * 0.2;
        ctx.stroke();

        ctx.restore();
      }

      // Render orbiting debris particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const y = centerY + height * 0.35 - p.yRatio * height * 0.65;
        const radius = width * (0.06 + p.yRatio * 0.35) * p.orbitRadiusRatio;
        const x = centerX + Math.cos(p.angle) * radius;
        const zAdjust = Math.sin(p.angle) * radius * 0.3;

        ctx.fillStyle = particleColor;
        ctx.globalAlpha = 0.4 + (Math.sin(p.angle) + 1) * 0.3;
        ctx.beginPath();
        ctx.arc(x, y + zAdjust, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset alpha
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [aura, primaryColor, secondaryColor, particleColor, glowColor]);

  return (
    <div className={`relative flex items-center justify-center ${containerSizes[size]} select-none pointer-events-none`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
      />
    </div>
  );
};
