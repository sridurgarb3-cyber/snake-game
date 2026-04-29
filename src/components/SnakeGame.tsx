import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!isGameOver) setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const move = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        setDirection(nextDirection);

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(prev - 2, 60)); // Increase speed
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const gameLoop = setInterval(move, speed);
    return () => clearInterval(gameLoop);
  }, [nextDirection, food, isPaused, isGameOver, speed, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = '#1a1a1a';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00f2ff' : '#00b8c4';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = '#00f2ff';
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff007f';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0; // Reset shadow for next frame
  }, [snake, food]);

  return (
    <div 
      id="snake-container"
      className="flex flex-col items-center justify-center p-8 glass-morphism rounded-none border border-neon-blue/20 bg-black/80 relative overflow-hidden"
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-pink z-20" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-blue z-20" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-blue z-20" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-pink z-20" />

      <div 
        id="snake-header"
        className="w-full flex justify-between items-center mb-6 px-4"
      >
        <div className="space-y-1">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-neon-blue/60">SENS_OR_FEED::02</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green animate-flicker" />
            <h2 className="text-2xl font-digital tracking-tight text-white uppercase glitch-text">Sector-04</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-neon-pink/60">PULSE_RATING</p>
          <p 
            id="snake-score-display"
            className="text-4xl font-digital font-bold text-neon-pink tabular-nums neon-text-pink leading-none mt-1"
          >
            {score.toString().padStart(4, '0')}
          </p>
        </div>
      </div>

      <div 
        id="canvas-wrapper"
        className="relative group border border-neon-blue/20 p-1 bg-neon-blue/5"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px] pointer-events-none z-10" />
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="bg-black cursor-crosshair shadow-[0_0_30px_rgba(0,242,255,0.1)] block"
          id="snake-canvas"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-[3px] z-20"
            >
              <h3 
                id="game-status-text"
                className={`text-8xl font-digital font-bold mb-12 tracking-[0.2em] glitch-text ${isGameOver ? 'text-neon-pink' : 'text-neon-blue'}`}
              >
                {isGameOver ? 'HALT' : 'VOID'}
              </h3>
              <button
                onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                className={`px-16 py-4 bg-transparent border-2 ${isGameOver ? 'border-neon-pink text-neon-pink' : 'border-neon-blue text-neon-blue'} font-digital text-xl tracking-[0.5em] transform transition hover:scale-105 active:scale-95 uppercase glitch-skew`}
                id="game-action-btn"
              >
                {isGameOver ? 'REBOOT' : 'RESUME'}
              </button>
              <p className="mt-8 text-white/20 font-mono text-[9px] uppercase tracking-[0.6em]">
                {isGameOver ? 'SYSTEM_INTEGRITY_TERMINATED' : 'WAITING_FOR_DATA_SYNC'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div 
        id="snake-telemetry"
        className="mt-6 flex gap-8 text-[9px] font-mono uppercase tracking-[0.4em] text-neon-blue/40"
      >
        <div className="flex items-center gap-2">
          <span className="w-1 h-3 bg-neon-blue/20" />
          FPS: 60
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-3 bg-neon-blue/20" />
          SPD: {Math.round(200 - speed)}ms
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-3 bg-neon-pink/20" />
          ID: S04_MATRIX
        </div>
      </div>
    </div>
  );
};
