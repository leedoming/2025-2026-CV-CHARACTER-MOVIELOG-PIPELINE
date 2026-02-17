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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full 
                      mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full 
                      mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-300 rounded-full 
                      mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 py-8">
        {/* Screen 1: 메인 입력 화면 */}
        {currentScreen === "input" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Screen1 onNext={() => setCurrentScreen("preview")} />
          </div>
        )}

        {/* Screen 2: 시나리오 미리보기 화면 */}
        {currentScreen === "preview" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Screen2 
              onEdit={() => setCurrentScreen("input")}
              onNext={() => setCurrentScreen("loading")}
            />
          </div>
        )}

        {/* Screen 3: 로딩 화면 */}
        {currentScreen === "loading" && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Screen3 onComplete={() => setCurrentScreen("result")} />
          </div>
        )}

        {/* Screen 4: 결과 화면 */}
        {currentScreen === "result" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Screen4 
              onReset={() => setCurrentScreen("preview")}
              onRestart={() => setCurrentScreen("input")}
            />
          </div>
        )}
      </div>
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
