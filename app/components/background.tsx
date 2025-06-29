"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function BlindsBackground() {
  const { theme } = useTheme();
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animate only when theme changes
  useEffect(() => {
    if (theme) {
      setAnimating(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setAnimating(false), theme === "dark" ? 1700 : 1000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [theme]);

  // Set body classes for animation
  useEffect(() => {
    if (animating) {
      document.body.classList.add("animation-ready");
      if (theme === "dark") document.body.classList.add("dark");
      else document.body.classList.remove("dark");
    } else {
      document.body.classList.remove("animation-ready");
    }
  }, [animating, theme]);

  // Blinds count
  const blindsCount = 12;

  return (
    <div
      id="dappled-light"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -100,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Glow layers */}
      <div id="glow"></div>
      <div id="glow-bounce"></div>
      {/* Perspective container */}
      <div className="perspective">
        {/* Leaves */}
        <div id="leaves">
          <svg style={{ width: 0, height: 0, position: "absolute" }}>
            <defs>
              <filter id="wind" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" numOctaves="2" seed="1">
                  <animate
                    attributeName="baseFrequency"
                    dur="16s"
                    keyTimes="0;0.33;0.66;1"
                    values="0.005 0.003;0.01 0.009;0.008 0.004;0.005 0.003"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic">
                  <animate
                    attributeName="scale"
                    dur="20s"
                    keyTimes="0;0.25;0.5;0.75;1"
                    values="45;55;75;55;45"
                    repeatCount="indefinite"
                  />
                </feDisplacementMap>
              </filter>
            </defs>
          </svg>
        </div>
        {/* Blinds */}
        <div id="blinds">
          <div className="shutters">
            {Array.from({ length: blindsCount }).map((_, i) => (
              <div className="shutter" key={i}></div>
            ))}
          </div>
          <div className="vertical">
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>
      {/* Progressive blur */}
      <div id="progressive-blur">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {/* Global styles */}
      <style jsx global>{`
        #leaves {
          background-image: url("/leaves.png");
        }
      `}</style>
    </div>
  );
}
