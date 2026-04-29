import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Zap, Shield, Activity } from 'lucide-react';

export default function App() {
  return (
    <div 
      id="root-container"
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-black font-mono selection:bg-neon-pink selection:text-white scanlines crt-flicker noise-bg"
    >
      {/* Background Grid Overlay */}
      <div 
        id="bg-grid-overlay"
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      >
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 242, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header Interace */}
      <header 
        id="header-interface"
        className="w-full max-w-6xl flex justify-between items-end mb-12 z-10 border-b border-neon-blue/20 pb-4"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div 
              id="system-icon"
              className="w-10 h-10 bg-neon-pink flex items-center justify-center neon-glow-pink animate-pulse"
            >
              <Zap size={22} className="text-black fill-current" />
            </div>
            <h1 
              id="app-title"
              className="text-4xl font-digital uppercase tracking-tighter italic leading-none glitch-text"
            >
              <span className="text-white">NEON</span>_SNAKE_<span className="text-neon-pink">OS</span>
            </h1>
          </div>
          <p className="text-[10px] text-neon-blue/40 tracking-[0.8em] uppercase pl-1">
            KERNEL_VERSION::4.2.0 // DECRYPT_STATUS::SUCCESS
          </p>
        </div>

        <div 
          id="system-telemetry"
          className="flex gap-12"
        >
          <div className="text-right hidden md:block">
            <p className="text-[9px] text-neon-blue/40 uppercase tracking-widest mb-1">DATA_INTEGRITY</p>
            <div className="flex items-center justify-end gap-2 text-neon-green">
              <span className="text-sm font-bold neon-text-green uppercase">99.9% VALID</span>
              <Shield size={16} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-neon-pink/40 uppercase tracking-widest mb-1">CORE_TEMP</p>
            <div className="flex items-center justify-end gap-2 text-neon-pink">
              <span className="text-sm font-bold neon-text-pink uppercase animate-pulse">OPTIMAL</span>
              <Activity size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Matrix Grid */}
      <main 
        id="main-matrix"
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10"
      >
        {/* Left Peripheral: Audio Protocol */}
        <div 
          id="peripheral-audio"
          className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            <MusicPlayer />
          </motion.div>

          <div 
            id="system-log-terminal"
            className="hidden lg:block glass-morphism p-4 border border-neon-blue/10 bg-black/40"
          >
            <div className="flex items-center gap-2 text-neon-blue mb-3 border-b border-neon-blue/20 pb-2">
              <Terminal size={14} />
              <span className="uppercase tracking-[0.3em] font-bold text-[10px]">Matrix_Trace.log</span>
            </div>
            <div className="font-mono text-[9px] text-neon-blue/50 space-y-1.5 h-32 overflow-hidden">
              <p className="text-neon-green/60">[{new Date().toLocaleTimeString()}] BOOTING_SEQUENCE_INITIALIZED...</p>
              <p>[S] LOADING_GRAPHICS_DRIVERS::GLITCH_RENDERER_v1</p>
              <p>[S] ESTABLISHING_PULSE_SYNC::0.4ms_LATENCY</p>
              <p className="text-neon-pink/60">[*] WARNING: HEURISTIC_ANOMALY_DETECTED_IN_SECTOR_04</p>
              <p>[S] ATTEMPTING_HOTSWAP_OVERRIDE...</p>
              <p className="text-neon-green/60">[S] OVERRIDE_SUCCESSFUL</p>
              <p className="animate-pulse">{`> AWAITING_CMD_INPUT_`}</p>
            </div>
          </div>
        </div>

        {/* Core Interface: Helix Protocol (Game) */}
        <div 
          id="core-helix-interface"
          className="lg:col-span-8 flex justify-center order-1 lg:order-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <SnakeGame />
          </motion.div>
        </div>
      </main>

      {/* Control Footer */}
      <footer 
        id="footer-controls"
        className="mt-12 w-full max-w-6xl flex justify-between items-center text-neon-blue/20 font-mono text-[10px] uppercase tracking-[0.5em] z-10 border-t border-neon-blue/10 pt-8"
      >
        <div className="flex gap-12">
          <span>Δ_MOVE: ARROWS</span>
          <span>Θ_SYST: SPACE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="glitch-text">SYNC_ESTABLISHED_4.2.x</span>
          <div className="w-2 h-2 bg-neon-pink animate-pulse" />
        </div>
      </footer>

      {/* Frame Accents */}
      <div className="fixed top-4 left-4 w-16 h-16 border-t border-l border-neon-blue/30 pointer-events-none z-50" />
      <div className="fixed top-4 right-4 w-16 h-16 border-t border-r border-neon-pink/30 pointer-events-none z-50" />
      <div className="fixed bottom-4 left-4 w-16 h-16 border-b border-l border-neon-pink/30 pointer-events-none z-50" />
      <div className="fixed bottom-4 right-4 w-16 h-16 border-b border-r border-neon-blue/30 pointer-events-none z-50" />
    </div>
  );
}
