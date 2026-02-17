// src/app/components/Screen3.tsx

import { Loader2, Sparkles, Film } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { AIService } from "@/services/ai.service";

interface Screen3Props {
  onComplete: () => void;
}

export function Screen3({ onComplete }: Screen3Props) {
  const { scenes, characterData, setScenes, setFinalVideoUrl } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const steps = [
    { icon: Sparkles, text: "AI 시나리오 분석 중...", duration: 60 },
    { icon: Film, text: "장면별 이미지 생성 중...", duration: 60 },
    { icon: Film, text: "영상 합성 중...", duration: 60 }
  ];

  useEffect(() => {
    let mounted = true;
    let hasStarted = false;
    
    const generateVideos = async () => {
      if (hasStarted) return;
      hasStarted = true;
      
      try {
        // Step 1: 시나리오 분석 (0-20%)
        setCurrentStep(0);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!mounted) return;
        setProgress(20);

        // Step 2: 각 씬 비디오 생성 (20-80%)
        setCurrentStep(1);
        const updatedScenes = [...scenes];
        const progressPerScene = 60 / scenes.length;

        for (let i = 0; i < scenes.length; i++) {
          if (!mounted) return;
          setCurrentSceneIndex(i);
          
          try {
            const videoUrl = await AIService.generateSceneVideo(
              scenes[i].description,
              characterData.imageUrl,
              scenes[i].id
            );
            updatedScenes[i] = { ...updatedScenes[i], videoUrl };
            setScenes(updatedScenes);
            
            setProgress(20 + (i + 1) * progressPerScene);
          } catch (error) {
            console.error(`Scene ${i + 1} video generation failed:`, error);
            // Use fallback video URL
            updatedScenes[i] = { ...updatedScenes[i], videoUrl: `/demo/videos/scene-${i + 1}.mp4` };
            setScenes(updatedScenes);
            setProgress(20 + (i + 1) * progressPerScene);
          }
        }

        // Step 3: 비디오 병합 (80-100%)
        if (!mounted) return;
        setCurrentStep(2);
        
        try {
          const videoUrls = updatedScenes
            .map(scene => scene.videoUrl)
            .filter((url): url is string => !!url);
          
          if (videoUrls.length === 0) {
            // Fallback if no videos generated
            const fallbackUrl = '/demo/videos/scene-1.mp4';
            setFinalVideoUrl(fallbackUrl);
          } else {
            const finalUrl = await AIService.mergeVideos(videoUrls);
            setFinalVideoUrl(finalUrl);
          }
          
          setProgress(100);
          
          setTimeout(() => {
            if (mounted) {
              onComplete();
            }
          }, 500);
        } catch (error) {
          console.error('Video merging failed:', error);
          // Fallback: use first available video
          const fallbackUrl = updatedScenes[0]?.videoUrl || '/demo/videos/scene-1.mp4';
          setFinalVideoUrl(fallbackUrl);
          setProgress(100);
          
          setTimeout(() => {
            if (mounted) {
              onComplete();
            }
          }, 500);
        }
      } catch (error) {
        console.error('Video generation process failed:', error);
        // Complete fallback
        setFinalVideoUrl('/demo/videos/scene-1.mp4');
        setProgress(100);
        
        setTimeout(() => {
          if (mounted) {
            onComplete();
          }
        }, 500);
      }
    };

    generateVideos();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array to run only once

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 min-h-screen flex items-center justify-center">
      {/* Hidden video element to prevent external script errors */}
      <video 
        id="twoXSpeed" 
        style={{ display: 'none' }}
        muted
        playsInline
      />
      
      <div className="w-full">
        {/* Main Loading Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 
                      overflow-hidden p-8 md:p-12">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-purple-500/5 
                        animate-pulse"></div>
          
          <div className="relative z-10 text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative inline-flex">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent 
                            border-t-purple-500 border-r-blue-500 animate-spin"></div>
              
              {/* Inner icon container */}
              <div className="relative p-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full">
                <div className="p-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full
                              shadow-2xl animate-pulse">
                  <CurrentIcon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              </div>

              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full 
                              transform -translate-x-1/2 shadow-lg"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full 
                              transform -translate-x-1/2 shadow-lg"></div>
              </div>
            </div>

            {/* Status Text */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                           bg-clip-text text-transparent">
                영상 생성 중입니다
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                {steps[currentStep].text}
                {currentStep === 1 && scenes[currentSceneIndex] && (
                  <span className="block text-sm mt-1">
                    ({currentSceneIndex + 1}/{scenes.length} 장면)
                  </span>
                )}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                {/* Background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent
                              animate-shimmer"></div>
                
                {/* Progress fill */}
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 
                           rounded-full transition-all duration-300 ease-out
                           shadow-lg shadow-purple-500/50"
                  style={{ width: `${progress}%` }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent 
                                rounded-full"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{Math.round(progress)}% 완료</span>
                <span className="text-gray-400">
                  약 {Math.max(1, Math.ceil((100 - progress) / 10))}초 남음
                </span>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500' 
                      : index < currentStep
                      ? 'w-2 bg-gray-400'
                      : 'w-2 bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-purple-900 font-medium">
                AI가 고품질 영상을 생성하고 있습니다
              </p>
              <p className="text-xs text-purple-700 mt-1">
                최상의 결과를 위해 몇 초가 소요될 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
