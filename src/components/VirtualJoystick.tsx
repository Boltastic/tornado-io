import React, { useEffect, useRef, useState } from 'react';

interface VirtualJoystickProps {
  onMove: (dx: number, dz: number) => void;
  deadzone?: number;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove, deadzone = 0.1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [handlePos, setHandlePos] = useState({ x: 0, y: 0 });

  const centerRef = useRef({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  // Keyboard controls state
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Keyboard WASD / Arrow key handler for desktop testing
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      updateKeyboardInput();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      updateKeyboardInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateKeyboardInput = () => {
    let dx = 0;
    let dz = 0;

    if (keysRef.current['a'] || keysRef.current['arrowleft']) dx -= 1;
    if (keysRef.current['d'] || keysRef.current['arrowright']) dx += 1;
    if (keysRef.current['w'] || keysRef.current['arrowup']) dz -= 1;
    if (keysRef.current['s'] || keysRef.current['arrowdown']) dz += 1;

    if (dx !== 0 || dz !== 0) {
      const len = Math.sqrt(dx * dx + dz * dz);
      onMove(dx / len, dz / len);
    } else {
      onMove(0, 0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return;

    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      centerRef.current = { x: centerX, y: centerY };

      updateJoystick(touch.clientX, touch.clientY);
      setActive(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setActive(false);
        setHandlePos({ x: 0, y: 0 });
        onMove(0, 0);
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    const maxRadius = 50; // Max displacement in px
    let dx = clientX - centerRef.current.x;
    let dy = clientY - centerRef.current.y;

    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) {
      setHandlePos({ x: 0, y: 0 });
      onMove(0, 0);
      return;
    }

    const normDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const handleX = Math.cos(angle) * normDist;
    const handleY = Math.sin(angle) * normDist;

    setHandlePos({ x: handleX, y: handleY });

    // Calculate normalized output [-1, 1]
    const magnitude = normDist / maxRadius;
    if (magnitude < deadzone) {
      onMove(0, 0);
    } else {
      const scaledMag = (magnitude - deadzone) / (1 - deadzone);
      const outDx = Math.cos(angle) * scaledMag;
      const outDz = Math.sin(angle) * scaledMag;
      onMove(outDx, outDz);
    }
  };

  return (
    <div
      className="absolute bottom-8 left-8 z-30 touch-none select-none flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        id="virtual-joystick-base"
        className={`w-32 h-32 rounded-full border-2 border-white/40 bg-slate-900/50 backdrop-blur-md flex items-center justify-center transition-opacity duration-200 ${
          active ? 'opacity-100 scale-105' : 'opacity-70'
        }`}
      >
        {/* Outer Ring Accent */}
        <div className="w-24 h-24 rounded-full border border-cyan-400/30" />

        {/* Joystick Handle */}
        <div
          id="virtual-joystick-handle"
          className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-400 border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `translate(${handlePos.x}px, ${handlePos.y}px)`,
          }}
        >
          <div className="w-4 h-4 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
};
