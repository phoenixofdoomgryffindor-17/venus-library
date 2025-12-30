"use client";

import { useEffect } from "react";

export function useCursorGlow() {
  useEffect(() => {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let rafId: number;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const animate = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
      glow.remove();
    };
  }, []);
}
