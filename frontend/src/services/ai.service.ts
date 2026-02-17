export const AIService = {
  // 시나리오 생성 + 각 장면별 이미지 생성
  generateScenario: async (
    name: string, 
    who: string, 
    where: string, 
    what: string, 
    how: string,
    characterImageUrl: string
  ) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      { 
        id: 1, 
        description: `${who} ${where} 도착한다`,
        imageUrl: '/demo/images/scene-1.png',
        title: 'Scene 1',
        duration: '4초'
      },
      { 
        id: 2, 
        description: `${who} ${what}`,
        imageUrl: '/demo/images/scene-2.png',
        title: 'Scene 2',
        duration: '4초'
      },
      { 
        id: 3, 
        description: `${who} ${how}`,
        imageUrl: '/demo/images/scene-3.png',
        title: 'Scene 3',
        duration: '4초'
      }
    ];
  },

  // 시나리오 재생성 (수정된 텍스트 기반)
  regenerateScenario: async (
    scenes: Array<{ id: number; description: string }>,
    characterImageUrl: string
  ) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return scenes.map(scene => ({
      ...scene,
      imageUrl: `/demo/images/scene-${scene.id}.png`,
      title: `Scene ${scene.id}`,
      duration: '4초'
    }));
  },

  // 개별 장면 영상 생성
  generateSceneVideo: async (sceneId: number, sceneDescription: string, characterImageUrl: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `/demo/videos/scene-${sceneId}.mp4`;
  },

  // 영상 병합
  mergeVideos: async (videoUrls: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 첫 번째 영상을 최종 영상으로 반환 (더미)
    return videoUrls[0] || '/demo/videos/scene-1.mp4';
  }
};
