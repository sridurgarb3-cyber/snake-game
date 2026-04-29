import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  url: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Gen // Synthwave',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop',
    duration: '03:45',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Glitch Horizon',
    artist: 'AI Gen // Electronic',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
    duration: '04:12',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'AI Gen // Lofi',
    cover: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1000&auto=format&fit=crop',
    duration: '02:58',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
      if (audioRef.current.ended) {
        nextTrack();
      }
    }
  };

  return (
    <div 
      id="audio-protocol-interface"
      className="w-full max-w-md glass-morphism p-6 border border-neon-blue/20 bg-black/60 relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,1)]"
    >
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="flex items-center gap-6 relative z-10">
        <motion.div 
          key={currentTrack.id}
          id={`track-asset-${currentTrack.id}`}
          initial={{ filter: 'grayscale(1)', opacity: 0 }}
          animate={{ filter: 'grayscale(0)', opacity: 1 }}
          className="relative shrink-0"
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-24 h-24 object-cover border border-neon-blue/30 glitch-skew grayscale hover:grayscale-0 transition-all duration-500"
          />
          {isPlaying && (
            <div className="absolute inset-0 border border-neon-pink animate-pulse mix-blend-overlay" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-neon-blue/60 mb-1">SRC_SIGNAL::DATA</p>
          <h3 
            id="track-title"
            className="text-xl font-digital truncate tracking-tight text-white uppercase"
          >
            {currentTrack.title}
          </h3>
          <p className="text-[10px] text-neon-pink/70 truncate font-mono uppercase tracking-widest mt-1">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 relative z-10">
        {/* Progress Bar Container */}
        <div id="progress-container" className="space-y-2">
          <div className="flex justify-between text-[8px] font-mono text-neon-blue/40 uppercase tracking-[0.4em]">
            <span>MOD_FREQ</span>
            <span>{currentTrack.duration}</span>
          </div>
          <div className="h-0.5 w-full bg-white/5 relative overflow-hidden">
            <motion.div
              className="h-full bg-neon-blue shadow-[0_0_10px_var(--color-neon-blue)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        {/* Master Controls */}
        <div 
          id="audio-controls"
          className="flex items-center justify-between gap-4"
        >
          <button 
            onClick={prevTrack}
            className="p-2 border border-neon-blue/20 text-neon-blue/60 hover:text-white hover:border-neon-blue rounded-none transition bg-black/40"
            id="prev-track-btn"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={togglePlay}
            className="flex-1 py-3 bg-neon-blue/10 border-2 border-neon-blue text-neon-blue flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all group/btn"
            id="play-pause-toggle"
          >
            {isPlaying ? 
              <Pause size={24} className="group-hover/btn:scale-110" /> : 
              <Play size={24} className="translate-x-0.5 group-hover/btn:scale-110" />
            }
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 border border-neon-blue/20 text-neon-blue/60 hover:text-white hover:border-neon-blue rounded-none transition bg-black/40"
            id="next-track-btn"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Bitrate Visualizer */}
      <div 
        id="bitrate-viz"
        className="mt-6 flex items-end justify-center gap-1 h-12 border-t border-neon-blue/10 pt-2"
      >
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            animate={isPlaying ? {
              height: [4, Math.random() * 32 + 4, 4],
              backgroundColor: i % 2 === 0 ? '#00f2ff' : '#ff007f'
            } : { height: 2, backgroundColor: '#111' }}
            transition={{
              duration: 0.2 + Math.random() * 0.3,
              repeat: Infinity,
              delay: i * 0.02
            }}
            className="w-1 bg-neon-blue opacity-50"
          />
        ))}
      </div>
    </div>
  );
};
