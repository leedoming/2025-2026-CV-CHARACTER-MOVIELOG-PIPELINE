import { VideoMergeService } from './video-merge.service';

export const AIService = {
  generateScenario: async (name: string, description: string) => {
    // Mock implementation - replace with actual AI service call
    return [
      { 
        id: 1, 
        description: `${name}이(가) ${description}`,
        imageUrl: '/demo/images/scene-1.png',
        title: 'Scene 1',
        duration: '4초'
      },
      { 
        id: 2, 
        description: `${name}의 다음 장면`,
        imageUrl: '/demo/images/scene-2.png',
        title: 'Scene 2',
        duration: '4초'
      },
      { 
        id: 3, 
        description: `${name}의 마지막 장면`,
        imageUrl: '/demo/images/scene-3.png',
        title: 'Scene 3',
        duration: '4초'
      }
    ];
  },

  generateSceneVideo: async (sceneDescription: string, characterImageUrl: string, sceneId: number) => {
    // Use demo videos from public/demo/videos/
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    return `/demo/videos/scene-${sceneId}.mp4`;
  },

  mergeVideos: async (videoUrls: string[]) => {
    try {
      // Extract scene IDs from video URLs
      const sceneIds = videoUrls.map(url => {
        const match = url.match(/scene-(\d+)\.mp4/);
        return match ? parseInt(match[1]) : 1;
      });
      
      // Use VideoMergeService to merge actual demo videos
      const mergedVideoUrl = await VideoMergeService.mergeVideos(sceneIds);
      return mergedVideoUrl;
    } catch (error) {
      console.error('Video merge error:', error);
      // Fallback: return first video URL if merge fails
      return videoUrls[0] || '/demo/videos/scene-1.mp4';
    }
  }
};
