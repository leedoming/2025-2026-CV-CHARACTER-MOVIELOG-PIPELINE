// src/app/components/Screen2.tsx

import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Edit3, Play, RefreshCw, Check, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { AIService } from "@/services/ai.service";
import { useState } from "react";

interface Screen2Props {
  onEdit: () => void;
  onNext: () => void;
}

export function Screen2({ onEdit, onNext }: Screen2Props) {
  const { scenes, setScenes, characterData } = useAppContext();
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleEditScene = (sceneId: number, description: string) => {
    setEditingSceneId(sceneId);
    setEditedDescription(description);
  };

  const handleSaveEdit = () => {
    if (editingSceneId) {
      setScenes(scenes.map(scene => 
        scene.id === editingSceneId 
          ? { ...scene, description: editedDescription }
          : scene
      ));
      setEditingSceneId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingSceneId(null);
    setEditedDescription("");
  };

  const handleRegenerateAll = async () => {
    setIsRegenerating(true);
    try {
      const updatedScenes = await AIService.regenerateScenario(
        scenes.map(s => ({ id: s.id, description: s.description })),
        characterData.imageUrl
      );
      setScenes(updatedScenes);
    } catch (error) {
      console.error('Regeneration error:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          시나리오 미리보기
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          각 장면을 확인하고 수정할 수 있습니다
        </p>
      </div>

      {/* Scene 카드 리스트 */}
      <div className="space-y-4 md:space-y-5 mb-6">
        {scenes.map((scene, index) => (
          <div 
            key={scene.id}
            className="group relative bg-white rounded-2xl border border-gray-200 
                     shadow-md hover:shadow-xl transition-all duration-300
                     overflow-hidden"
          >
            {/* Scene Number Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 
                            text-white px-3 py-1.5 rounded-full shadow-lg text-sm font-semibold">
                <span>{scene.title}</span>
                <span className="text-xs opacity-80">• {scene.duration}</span>
              </div>
            </div>

            {/* Edit Button */}
            {editingSceneId !== scene.id && (
              <button 
                onClick={() => handleEditScene(scene.id, scene.description)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full 
                         shadow-md hover:shadow-lg transition-all duration-300
                         opacity-0 group-hover:opacity-100"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
              </button>
            )}

            <div className="p-5 md:p-6 space-y-4">
              {/* 이미지 영역 */}
              <div className="relative aspect-video border-2 border-dashed border-gray-200 
                            rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100
                            group-hover:border-purple-300 transition-all duration-300">
                {scene.imageUrl ? (
                  <>
                    <img 
                      src={scene.imageUrl} 
                      alt={`Scene ${scene.id}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-lg 
                                    flex items-center justify-center
                                    group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-purple-500 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-green-500 
                                  rounded-full shadow-sm text-xs font-medium text-white">
                      생성 완료
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
                    <div className="relative h-full flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg 
                                      flex items-center justify-center
                                      group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-purple-500" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          Scene {scene.id} 이미지
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm 
                                  rounded-full shadow-sm text-xs font-medium text-gray-600">
                      생성 대기중
                    </div>
                  </>
                )}
              </div>

              {/* Scene 설명 */}
              <div className="space-y-2">
                {editingSceneId === scene.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="min-h-[80px] border-purple-300 focus:border-purple-400"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4 mr-1" />
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-1 h-12 bg-gradient-to-b from-purple-500 to-blue-500 
                                  rounded-full mt-1"></div>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed flex-1">
                      {scene.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Connecting line to next scene */}
            {index < scenes.length - 1 && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-0">
                <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 
                          rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">총 영상 길이</p>
              <p className="text-xs text-gray-600">약 12초</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerateAll}
            disabled={isRegenerating}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? '재생성 중...' : '재생성'}
          </Button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="flex-1 h-12 text-base font-semibold
                   border-2 border-gray-300 hover:border-purple-400
                   hover:bg-purple-50 transition-all duration-300"
          onClick={onEdit}
        >
          <Edit3 className="w-5 h-5 mr-2" />
          처음으로
        </Button>
        <Button 
          className="flex-1 h-12 text-base font-semibold
                   bg-gradient-to-r from-purple-600 to-blue-600 
                   hover:from-purple-700 hover:to-blue-700
                   shadow-lg hover:shadow-xl
                   transition-all duration-300"
          onClick={onNext}
        >
          <Play className="w-5 h-5 mr-2" />
          영상 생성하기
        </Button>
      </div>
    </div>
  );
}
