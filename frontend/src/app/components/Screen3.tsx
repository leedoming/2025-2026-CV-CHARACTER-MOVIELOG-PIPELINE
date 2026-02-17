// src/app/components/Screen3.tsx

import { Loader2, Sparkles, Film, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { AIService } from "@/services/ai.service";
import { Button } from "@/app/components/ui/button";

interface Screen3Props {
  onComplete: () => void;
}

export function Screen3({ onComplete }: Screen3Props) {
  const { scenes, characterData, setScenes, setFinalVideoUrl } = useAppContext();
  const [sceneStatuses, setSceneStatuses] = useState<{
    [key: number]: 'pending' | 'generating' | 'completed' | 'error'
  }>({});
  const [regeneratingScene, setRegeneratingScene] = useState<number | null>(null);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    const initialStatuses: { [key: number]: 'pending' | 'generating' | 'completed' | 'error' } = {};
    scenes.forEach(scene => {
      initialStatuses[scene.id] = 'pending';
    });
    setSceneStatuses(initialStatuses);

    generateAllScenes();
  }, []);

  const generateAllScenes = async () => {
    const updatedScenes = [...scenes];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      setSceneStatuses(prev => ({ ...prev, [scene.id]: 'generating' }));

      try {
        const videoUrl = await AIService.generateSceneVideo(
          scene.id,
          scene.description,
          characterData.imageUrl
        );
        updatedScenes[i] = { ...updatedScenes[i], videoUrl };
        setScenes(updatedScenes);
        setSceneStatuses(prev => ({ ...prev, [scene.id]: 'completed' }));
      } catch (error) {
        console.error(`Scene ${scene.id} video generation failed:`, error);
        setSceneStatuses(prev => ({ ...prev, [scene.id]: 'error' }));
      }
    }

    setAllCompleted(true);
  };

  const regenerateScene = async (sceneId: number) => {
    setRegeneratingScene(sceneId);
    setSceneStatuses(prev => ({ ...prev, [sceneId]: 'generating' }));

    const sceneIndex = scenes.findIndex(s => s.id === sceneId);
    if (sceneIndex === -1) return;

    try {
      const videoUrl = await AIService.generateSceneVideo(
        sceneId,
        scenes[sceneIndex].description,
        characterData.imageUrl
      );
      const updatedScenes = [...scenes];
      updatedScenes[sceneIndex] = { ...updatedScenes[sceneIndex], videoUrl };
      setScenes(updatedScenes);
      setSceneStatuses(prev => ({ ...prev, [sceneId]: 'completed' }));
    } catch (error) {
      console.error(`Scene ${sceneId} regeneration failed:`, error);
      setSceneStatuses(prev => ({ ...prev, [sceneId]: 'error' }));
    } finally {
      setRegeneratingScene(null);
    }
  };

  const handleMergeAndComplete = async () => {
    try {
      const videoUrls = scenes
        .map(scene => scene.videoUrl)
        .filter((url): url is string => !!url);

      if (videoUrls.length === 0) {
        alert('생성된 영상이 없습니다.');
        return;
      }

      const finalUrl = await AIService.mergeVideos(videoUrls);
      setFinalVideoUrl(finalUrl);
      onComplete();
    } catch (error) {
      console.error('Video merging failed:', error);
      alert('영상 병합에 실패했습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'generating': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'generating': return '생성 중...';
      case 'error': return '실패';
      default: return '대기 중';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          장면별 영상 생성
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          각 장면의 영상을 확인하고 마음에 들지 않으면 재생성할 수 있습니다
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 
                              text-white rounded-full text-sm font-semibold">
                    {scene.title}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    getStatusColor(sceneStatuses[scene.id] || 'pending')
                  }`}>
                    {getStatusText(sceneStatuses[scene.id] || 'pending')}
                  </div>
                </div>
                {sceneStatuses[scene.id] === 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => regenerateScene(scene.id)}
                    disabled={regeneratingScene === scene.id}
                    className="border-purple-300 hover:bg-purple-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${
                      regeneratingScene === scene.id ? 'animate-spin' : ''
                    }`} />
                    재생성
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                  {scene.videoUrl ? (
                    <video
                      src={scene.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      muted
                      loop
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {sceneStatuses[scene.id] === 'generating' ? (
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                      ) : (
                        <Film className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {scene.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {allCompleted && (
        <div className="flex justify-center">
          <Button
            onClick={handleMergeAndComplete}
            className="h-14 px-8 text-base font-semibold
                     bg-gradient-to-r from-purple-600 to-blue-600 
                     hover:from-purple-700 hover:to-blue-700
                     shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            영상 병합 및 완료
          </Button>
        </div>
      )}

      {!allCompleted && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            <p className="text-sm text-blue-900">
              영상을 생성하고 있습니다. 잠시만 기다려주세요...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
