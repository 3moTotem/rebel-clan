"use client";

import { useEffect, useRef } from "react";

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMouseMove);

    function createParticle() {
      return {
        x: Math.random() * canvas!.width,
        y: canvas!.height + 10,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.4 + 0.15),
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.35 + 0.05,
        life: 0,
      };
    }

    for (let i = 0; i < 45; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas!.height;
      p.life = Math.random() * 1000;
      particles.push(p);
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const time = Date.now() * 0.0003;
      const mx = mouseRef.current.x / canvas!.width;
      const my = mouseRef.current.y / canvas!.height;

      const grd1 = ctx!.createRadialGradient(
        canvas!.width * (0.3 + mx * 0.08),
        canvas!.height * 0.25,
        0,
        canvas!.width * 0.3,
        canvas!.height * 0.25,
        canvas!.width * 0.45
      );
      grd1.addColorStop(0, "rgba(139, 90, 43, 0.035)");
      grd1.addColorStop(0.5, "rgba(160, 114, 74, 0.015)");
      grd1.addColorStop(1, "transparent");
      ctx!.fillStyle = grd1;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      const grd2 = ctx!.createRadialGradient(
        canvas!.width * (0.7 - mx * 0.04),
        canvas!.height * (0.65 + my * 0.08),
        0,
        canvas!.width * 0.7,
        canvas!.height * 0.65,
        canvas!.width * 0.35
      );
      grd2.addColorStop(
        0,
        `rgba(205, 133, 63, ${0.02 + Math.sin(time) * 0.008})`
      );
      grd2.addColorStop(1, "transparent");
      ctx!.fillStyle = grd2;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      if (particles.length < 45) particles.push(createParticle());

      particles = particles.filter((p) => {
        p.x += p.vx + (mx - 0.5) * 0.15;
        p.y += p.vy;
        p.life += 1;
        const alpha = Math.sin((p.life / 600) * Math.PI) * p.opacity;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(139, 90, 43, ${Math.max(0, alpha)})`;
        ctx!.fill();

        return p.y > -10;
      });

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.025]"
          style={{
            background:
              "radial-gradient(circle, rgba(139,90,43,1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{
            background:
              "radial-gradient(circle, rgba(205,133,63,1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>
    </>
  );
}
