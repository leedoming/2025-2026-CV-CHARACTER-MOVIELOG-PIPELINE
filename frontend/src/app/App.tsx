// src/app/App.tsx

import { useState } from "react";
import { AppProvider } from "@/context/AppContext";
import { Screen1 } from "@/app/components/Screen1";
import { Screen2 } from "@/app/components/Screen2";
import { Screen3 } from "@/app/components/Screen3";
import { Screen4 } from "@/app/components/Screen4";

type ScreenType = "input" | "preview" | "loading" | "result";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("input");

  return (
    <div className="cinema-bg" style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Cinematic ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Primary violet orb */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float1 20s ease-in-out infinite',
        }} />
        {/* Blue orb */}
        <div style={{
          position: 'absolute', top: '30%', right: '-10%',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float2 25s ease-in-out infinite',
        }} />
        {/* Deep violet bottom */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '30%',
          width: '700px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float3 30s ease-in-out infinite',
        }} />
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 0%, transparent 80%)',
        }} />
      </div>

      {/* Step indicator */}
      <div style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, display: 'flex', alignItems: 'center', gap: '6px',
        padding: '6px 12px', borderRadius: '999px',
        background: 'rgba(10,10,16,0.9)', backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
      }}>
        {(['input', 'preview', 'loading', 'result'] as ScreenType[]).map((step, i) => {
          const labels = ['CHARACTER', 'SCENARIO', 'RENDER', 'RESULT'];
          const isCurrent = currentScreen === step;
          const isPast = ['input', 'preview', 'loading', 'result'].indexOf(currentScreen) > i;
          return (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {i > 0 && (
                <div style={{ width: '16px', height: '1px', background: isPast ? 'rgba(124,58,237,0.5)' : 'var(--glass-border)', transition: 'background 0.4s' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: isCurrent ? 'var(--accent-violet)' : isPast ? 'rgba(124,58,237,0.5)' : 'var(--text-muted)',
                  boxShadow: isCurrent ? '0 0 8px var(--accent-violet)' : 'none',
                  transition: 'background 0.4s, box-shadow 0.4s',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isCurrent ? 'var(--text-accent)' : isPast ? 'rgba(196,181,253,0.5)' : 'var(--text-muted)',
                  transition: 'color 0.4s',
                }}>
                  {labels[i]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative" style={{ zIndex: 10, paddingTop: '60px', paddingBottom: '40px' }}>
        {currentScreen === "input" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Screen1 onNext={() => setCurrentScreen("preview")} />
          </div>
        )}
        {currentScreen === "preview" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Screen2
              onEdit={() => setCurrentScreen("input")}
              onNext={() => setCurrentScreen("loading")}
            />
          </div>
        )}
        {currentScreen === "loading" && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Screen3 onComplete={() => setCurrentScreen("result")} />
          </div>
        )}
        {currentScreen === "result" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Screen4
              onReset={() => setCurrentScreen("preview")}
              onRestart={() => setCurrentScreen("input")}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, -60px) scale(1.05); }
          66%       { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-50px, 40px) scale(1.08); }
          66%       { transform: translate(20px, -30px) scale(0.92); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, -40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}