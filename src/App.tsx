/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useCallback } from 'react';
import { X, Circle, RotateCcw, Trophy, User } from 'lucide-react';

type Player = 'X' | 'O';
type SquareValue = Player | null;

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
  key?: number;
}

const Square = ({ value, onClick, isWinningSquare, disabled }: SquareProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={`
        relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl flex items-center justify-center
        text-4xl transition-all duration-300
        ${!value && !disabled ? 'hover:bg-gray-100 cursor-pointer active:scale-95' : 'cursor-default'}
        ${isWinningSquare ? 'bg-black text-white shadow-xl scale-105 z-10' : 'bg-white border border-gray-100 shadow-sm'}
      `}
    >
      <AnimatePresence mode="wait">
        {value === 'X' && (
          <motion.div
            key="X"
            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <X size={48} strokeWidth={2.5} className={isWinningSquare ? 'text-white' : 'text-zinc-800'} />
          </motion.div>
        )}
        {value === 'O' && (
          <motion.div
            key="O"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Circle size={44} strokeWidth={2.5} className={isWinningSquare ? 'text-white' : 'text-zinc-500'} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default function App() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (sqs: SquareValue[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (sqs[a] && sqs[a] === sqs[b] && sqs[a] === sqs[c]) {
        return { winner: sqs[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleSquareClick = useCallback((i: number) => {
    if (squares[i] || winningLine) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    const winInfo = calculateWinner(nextSquares);
    if (winInfo) {
      setWinningLine(winInfo.line);
    }
  }, [squares, xIsNext, winningLine]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
  };

  const winInfo = calculateWinner(squares);
  const isDraw = !winInfo && squares.every((sq) => sq !== null);
  const status = winInfo 
    ? `Winner: ${winInfo.winner}` 
    : isDraw 
    ? "It's a Draw!" 
    : `Next: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 font-sans selection:bg-zinc-200 flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-400 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-400 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center gap-12"
      >
        <div className="text-center space-y-2">
          <motion.h1 
            className="text-4xl font-light tracking-tight text-zinc-900"
            animate={{ scale: winningLine ? 1.05 : 1 }}
          >
            Tic Tac Toe
          </motion.h1>
          <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase">
            Minimalist Classic
          </p>
        </div>

        <div className="flex justify-between w-full px-4 mb-4">
          <div className={`flex flex-col items-center gap-1 transition-opacity ${xIsNext && !winInfo && !isDraw ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`p-3 rounded-xl ${xIsNext ? 'bg-zinc-100' : 'bg-transparent'}`}>
              <X size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Player 1</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-lg font-medium tracking-tight"
              >
                {isDraw ? (
                  <span className="text-zinc-500 italic">No winner today</span>
                ) : winInfo ? (
                  <span className="flex items-center gap-2 text-zinc-950 font-bold">
                    <Trophy size={18} className="text-amber-500" />
                    {winInfo.winner} Wins!
                  </span>
                ) : (
                  <span className="text-zinc-500">
                    {xIsNext ? "X's turn" : "O's turn"}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={`flex flex-col items-center gap-1 transition-opacity ${!xIsNext && !winInfo && !isDraw ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`p-3 rounded-xl ${!xIsNext ? 'bg-zinc-100' : 'bg-transparent'}`}>
              <Circle size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Player 2</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          {squares.map((sq, i) => (
            <Square
              key={i}
              value={sq}
              onClick={() => handleSquareClick(i)}
              isWinningSquare={winningLine?.includes(i) ?? false}
              disabled={!!winInfo || isDraw}
            />
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-medium text-sm transition-colors hover:bg-zinc-800 shadow-lg shadow-zinc-200"
          >
            <RotateCcw size={18} />
            Reset Match
          </motion.button>
        </div>

        <footer className="mt-12 text-[10px] text-zinc-400 font-medium tracking-widest uppercase flex flex-col items-center gap-4">
          <div className="h-px w-8 bg-zinc-200" />
          <span>Local Multiplayer Only</span>
        </footer>
      </motion.div>
    </div>
  );
}

