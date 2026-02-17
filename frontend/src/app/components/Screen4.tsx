// src/app/components/Screen4.tsx

import { Button } from "@/app/components/ui/button";
import { Play, Download, Share2, RefreshCw, Sparkles, Pause, SkipForward, SkipBack } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

interface Screen4Props {
  onReset: () => void;
  onRestart: () => void;
}

interface Playlist {
  videos: string[];
  currentIndex: number;
  isPlaylist: boolean;
}

export function Screen4({ onReset, onRestart }: Screen4Props) {
  const { finalVideoUrl, resetAll } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parse playlist from finalVideoUrl
  useEffect(() => {
    if (finalVideoUrl && finalVideoUrl.startsWith('playlist:')) {
      try {
        const playlistData = JSON.parse(finalVideoUrl.replace('playlist:', ''));
        setPlaylist(playlistData);
        setCurrentVideoIndex(0);
      } catch (error) {
        console.error('Failed to parse playlist:', error);
      }
    }
  }, [finalVideoUrl]);

  const getCurrentVideoUrl = () => {
    if (playlist && playlist.videos[currentVideoIndex]) {
      return playlist.videos[currentVideoIndex];
    }
    return finalVideoUrl;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    if (playlist && currentVideoIndex < playlist.videos.length - 1) {
      // Play next video
      setCurrentVideoIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleNextVideo = () => {
    if (playlist && currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const handlePrevVideo = () => {
    if (playlist && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  // Auto-play next video when currentVideoIndex changes
  useEffect(() => {
    if (videoRef.current && playlist) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentVideoIndex, playlist]);

  const handleDownload = () => {
    // 로컬 모드에서는 실제 다운로드 대신 알림만 표시
    alert('다운로드 기능은 AWS 배포 시 구현됩니다.');
  };

  const handleShare = () => {
    // 공유 기능
    if (navigator.share) {
      navigator.share({
        title: 'AI 생성 영상',
        text: '제가 만든 AI 영상을 확인해보세요!',
        url: finalVideoUrl,
      }).catch(console.error);
    } else {
      alert('공유 기능은 지원하지 않는 브라우저입니다.');
    }
  };

  const handleRestart = () => {
    resetAll();
    onRestart();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      {/* Header with celebration effect */}
      <div className="text-center mb-6 md:mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 
                      rounded-full border border-green-200">
          <Sparkles className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">영상 생성 완료!</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          멋진 영상이 완성되었습니다
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          영상을 확인하고 다운로드하거나 공유해보세요
        </p>
      </div>

      {/* Video Player Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
        {/* Decorative gradient top */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>

        <div className="p-4 md:p-6">
          {/* 영상 플레이어 영역 (16:9) */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 
                        shadow-inner mb-4 group cursor-pointer"
               onClick={handlePlayPause}>
            {getCurrentVideoUrl() ? (
              <>
                <video
                  ref={videoRef}
                  src={getCurrentVideoUrl()}
                  className="w-full h-full object-cover"
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Play/Pause Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}>
                  <div className="relative">
                    {/* Pulsing rings */}
                    {!isPlaying && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
                      </>
                    )}
                    
                    {/* Play/Pause button */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full 
                                  bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center
                                  group-hover:scale-110 transition-transform duration-300">
                      {isPlaying ? (
                        <Pause className="w-10 h-10 md:w-12 md:h-12 text-purple-600" />
                      ) : (
                        <Play className="w-10 h-10 md:w-12 md:h-12 text-purple-600 ml-1" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Playlist controls */}
                {playlist && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrevVideo(); }}
                        disabled={currentVideoIndex === 0}
                        className="p-2 bg-black/70 backdrop-blur-sm rounded-lg disabled:opacity-50"
                      >
                        <SkipBack className="w-4 h-4 text-white" />
                      </button>
                      <div className="px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg">
                        <span className="text-white text-sm font-medium">
                          {currentVideoIndex + 1} / {playlist.videos.length}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNextVideo(); }}
                        disabled={currentVideoIndex === playlist.videos.length - 1}
                        className="p-2 bg-black/70 backdrop-blur-sm rounded-lg disabled:opacity-50"
                      >
                        <SkipForward className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg">
                      <span className="text-white text-sm font-medium">1080p</span>
                    </div>
                  </div>
                )}

                {/* Single video controls */}
                {!playlist && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg">
                      {isPlaying ? (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                      <span className="text-white text-sm font-medium">00:12</span>
                    </div>
                    <div className="px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg">
                      <span className="text-white text-sm font-medium">1080p</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white text-lg">비디오를 불러오는 중...</p>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-gray-200 hover:border-purple-400 hover:bg-purple-50
                       transition-all duration-300"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-gray-200 hover:border-blue-400 hover:bg-blue-50
                       transition-all duration-300"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>
          </div>

          {/* Video Details */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">12초</p>
              <p className="text-xs text-gray-600 mt-1">총 길이</p>
            </div>
            <div className="text-center border-x border-gray-300">
              <p className="text-2xl font-bold text-blue-600">3개</p>
              <p className="text-xs text-gray-600 mt-1">장면</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">1080p</p>
              <p className="text-xs text-gray-600 mt-1">화질</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="flex-1 h-12 text-base font-semibold
                   border-2 border-gray-300 hover:border-purple-400
                   hover:bg-purple-50 transition-all duration-300
                   group"
          onClick={onReset}
        >
          <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          다시 만들기
        </Button>
        <Button 
          className="flex-1 h-12 text-base font-semibold
                   bg-gradient-to-r from-purple-600 to-blue-600 
                   hover:from-purple-700 hover:to-blue-700
                   shadow-lg hover:shadow-xl
                   transition-all duration-300
                   group relative overflow-hidden"
          onClick={handleRestart}
        >
          <span className="relative z-10 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            새로운 영상 만들기
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </div>

      {/* Success message */}
      <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-green-900 font-semibold">
              고품질 AI 영상이 생성되었습니다!
            </p>
            <p className="text-xs text-green-700 mt-1">
              영상은 자동으로 저장되며, 언제든지 다시 확인하실 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
