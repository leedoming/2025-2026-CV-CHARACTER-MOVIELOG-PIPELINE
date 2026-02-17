// src/app/components/Screen1.tsx

import { Upload, Sparkles, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { StorageService } from "@/services/storage.service";
import { AIService } from "@/services/ai.service";
import { useState } from "react";

interface Screen1Props {
  onNext: () => void;
}

export function Screen1({ onNext }: Screen1Props) {
  const { characterData, setCharacterData, setScenes } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: '이미지 파일만 업로드 가능합니다.' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, image: '파일 크기는 10MB 이하여야 합니다.' });
      return;
    }

    try {
      const imageUrl = await StorageService.uploadImage(file);
      setCharacterData({
        ...characterData,
        image: file,
        imageUrl,
      });
      setErrors({ ...errors, image: '' });
    } catch (error) {
      console.error('Image upload error:', error);
      setErrors({ ...errors, image: '이미지 업로드에 실패했습니다.' });
    }
  };

  const handleRemoveImage = () => {
    setCharacterData({
      ...characterData,
      image: null,
      imageUrl: '',
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!characterData.imageUrl) newErrors.image = '캐릭터 이미지를 업로드해주세요.';
    if (!characterData.name.trim()) newErrors.name = '캐릭터 이름을 입력해주세요.';
    if (!characterData.who.trim()) newErrors.who = '누가를 입력해주세요.';
    if (!characterData.where.trim()) newErrors.where = '어디서를 입력해주세요.';
    if (!characterData.what.trim()) newErrors.what = '무엇을을 입력해주세요.';
    if (!characterData.how.trim()) newErrors.how = '어떻게를 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateScenario = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const generatedScenes = await AIService.generateScenario(
        characterData.name,
        characterData.who,
        characterData.where,
        characterData.what,
        characterData.how,
        characterData.imageUrl
      );
      setScenes(generatedScenes);
      onNext();
    } catch (error) {
      console.error('Scenario generation error:', error);
      setErrors({ ...errors, general: '시나리오 생성에 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
      {/* Header with gradient */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI 영상 생성
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          캐릭터와 시나리오를 입력하고 AI가 영상을 만들어드립니다
        </p>
      </div>

      {/* Main Card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>
        
        <div className="p-6 md:p-8 space-y-6">
          {/* 캐릭터 이미지 업로드 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-800">
              캐릭터 이미지
            </Label>
            <div className="relative group aspect-square border-2 border-dashed rounded-xl 
                          hover:border-purple-400 transition-all duration-300 cursor-pointer
                          bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-blue-50"
                 style={characterData.imageUrl ? {
                   backgroundImage: `url(${characterData.imageUrl})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 } : {}}>
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {characterData.imageUrl ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveImage();
                  }}
                  className="absolute top-3 right-3 z-20 p-2 bg-red-500 text-white rounded-full
                           hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-white rounded-full shadow-lg group-hover:shadow-xl 
                                group-hover:scale-110 transition-all duration-300">
                    <Upload className="w-8 h-8 md:w-10 md:h-10 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm md:text-base font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
                      이미지를 드래그하거나 클릭하세요
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG (최대 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* 캐릭터 이름 */}
          <div className="space-y-3">
            <Label htmlFor="character-name" className="text-base font-semibold text-gray-800">
              캐릭터 이름
            </Label>
            <Input 
              id="character-name"
              type="text" 
              placeholder="예: 눈송이"
              value={characterData.name}
              onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
              className="h-12 text-base border-gray-200 focus:border-purple-400 
                       focus:ring-purple-400/20 transition-all"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* 영상 설명 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-800">
              영상 설명
            </Label>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="who" className="text-sm text-gray-600">누가</Label>
                <Input 
                  id="who"
                  placeholder="예: 눈송이가"
                  value={characterData.who}
                  onChange={(e) => setCharacterData({ ...characterData, who: e.target.value })}
                  className="mt-1 border-gray-200 focus:border-purple-400"
                />
                {errors.who && <p className="text-sm text-red-500 mt-1">{errors.who}</p>}
              </div>
              
              <div>
                <Label htmlFor="where" className="text-sm text-gray-600">어디서</Label>
                <Input 
                  id="where"
                  placeholder="예: 카페에서"
                  value={characterData.where}
                  onChange={(e) => setCharacterData({ ...characterData, where: e.target.value })}
                  className="mt-1 border-gray-200 focus:border-purple-400"
                />
                {errors.where && <p className="text-sm text-red-500 mt-1">{errors.where}</p>}
              </div>
              
              <div>
                <Label htmlFor="what" className="text-sm text-gray-600">무엇을</Label>
                <Input 
                  id="what"
                  placeholder="예: 커피를 마시며"
                  value={characterData.what}
                  onChange={(e) => setCharacterData({ ...characterData, what: e.target.value })}
                  className="mt-1 border-gray-200 focus:border-purple-400"
                />
                {errors.what && <p className="text-sm text-red-500 mt-1">{errors.what}</p>}
              </div>
              
              <div>
                <Label htmlFor="how" className="text-sm text-gray-600">어떻게</Label>
                <Input 
                  id="how"
                  placeholder="예: 노트북을 한다"
                  value={characterData.how}
                  onChange={(e) => setCharacterData({ ...characterData, how: e.target.value })}
                  className="mt-1 border-gray-200 focus:border-purple-400"
                />
                {errors.how && <p className="text-sm text-red-500 mt-1">{errors.how}</p>}
              </div>
            </div>
          </div>

          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* 시나리오 생성 버튼 */}
          <Button 
            className="w-full h-14 text-base font-semibold
                     bg-gradient-to-r from-purple-600 to-blue-600 
                     hover:from-purple-700 hover:to-blue-700
                     shadow-lg hover:shadow-xl
                     transition-all duration-300
                     group relative overflow-hidden
                     disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateScenario}
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {isLoading ? '시나리오 생성 중...' : '시나리오 생성하기'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">
              AI가 자동으로 3개의 장면으로 시나리오를 구성합니다
            </p>
            <p className="text-xs text-blue-700 mt-1">
              생성 후 각 장면을 수정하거나 재생성할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
