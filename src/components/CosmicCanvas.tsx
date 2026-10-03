import React, { useEffect, useRef } from 'react';
import { ColorPalette, ThemeMode } from '../context/AppContext';

interface CosmicCanvasProps {
  interactive?: boolean;
  intensity?: number;
  className?: string;
  showRings?: boolean;
  palette?: ColorPalette;
  themeMode?: ThemeMode;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  phase: number;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  interactive = true,
  intensity = 1.0,
  className = '',
  showRings = true,
  palette = 'cyan',
  themeMode = 'oled',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
      if (!mouse.active) {
        mouse.targetX = width / 2;
        mouse.targetY = height / 2;
      }
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Dynamic palette color mapping
    const getPaletteColors = (p: ColorPalette, mode: ThemeMode) => {
      if (mode === 'light') {
        switch (p) {
          case 'emerald':
            return ['#059669', '#10B981', '#34D399', '#0D9488', '#6EE7B7'];
          case 'indigo':
            return ['#4F46E5', '#6366F1', '#818CF8', '#9333EA', '#A855F7'];
          case 'amber':
            return ['#D97706', '#F59E0B', '#FBBF24', '#EA580C', '#F97316'];
          case 'rose':
            return ['#E11D48', '#F43F5E', '#FB7185', '#DB2777', '#F472B6'];
          case 'cyan':
          default:
            return ['#0284C7', '#06B6D4', '#38BDF8', '#4F46E5', '#22D3EE'];
        }
      }

      switch (p) {
        case 'emerald':
          return ['#10B981', '#34D399', '#6EE7B7', '#14B8A6', '#A7F3D0'];
        case 'indigo':
          return ['#6366F1', '#818CF8', '#A78BFA', '#C084FC', '#E0E7FF'];
        case 'amber':
          return ['#F59E0B', '#FBBF24', '#FCD34D', '#FB923C', '#FEF3C7'];
        case 'rose':
          return ['#F43F5E', '#FB7185', '#FDA4AF', '#F472B6', '#FFE4E6'];
        case 'cyan':
        default:
          return ['#38BDF8', '#60A5FA', '#818CF8', '#22D3EE', '#E0E7FF'];
      }
    };

    const colors = getPaletteColors(palette, themeMode);
    const particleCount = Math.floor((width * height) / 9500);

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = themeMode === 'light' ? Math.random() * 0.45 + 0.15 : Math.random() * 0.7 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      angle += 0.003;
      const coreX = width / 2;
      const coreY = height / 2;

      // 1. Ambient Radial Glow
      const glowRadius = Math.min(width, height) * 0.48;
      const glowGrad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, glowRadius);

      if (themeMode === 'light') {
        glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
        glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else if (themeMode === 'oled') {
        glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
        glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.16)');
        glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
        glowGrad.addColorStop(1, 'rgba(11, 15, 25, 0)');
      }

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Orbital Rings
      if (showRings) {
        ctx.save();
        ctx.translate(coreX, coreY);
        ctx.rotate(angle * 0.4);

        const ringCount = 3;
        for (let r = 1; r <= ringCount; r++) {
          const rx = 140 * r;
          const ry = 65 * r;

          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, (r * Math.PI) / 6, 0, Math.PI * 2);
          ctx.strokeStyle = themeMode === 'light'
            ? `rgba(6, 182, 212, ${0.12 / r})`
            : `rgba(56, 189, 248, ${0.18 / r})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Update & Draw Particles with Mouse Gravitational Warp
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 260 && dist > 1) {
          const force = (1 - dist / 260) * 0.6 * p.z;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.phase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.25;
        p.alpha = Math.max(0.08, Math.min(1, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 4. Central Horizon Flare
      const flareGradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 80);
      flareGradient.addColorStop(
        0,
        themeMode === 'light' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.35)'
      );
      flareGradient.addColorStop(
        0.4,
        themeMode === 'light' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.2)'
      );
      flareGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = flareGradient;
      ctx.beginPath();
      ctx.arc(coreX, coreY, 80, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, intensity, showRings, palette, themeMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
    />
  );
};
