
import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { TASBEEHAT, TASBEEH_TARGETS } from '../constants';

const Tasbeeh: React.FC = () => {
  const [count, setCount] = useState(0);
  const [phrase, setPhrase] = useState(TASBEEHAT[0]);
  const [target, setTarget] = useState(TASBEEH_TARGETS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound logic
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio context not allowed yet", e);
    }
  }, [soundEnabled]);

  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    
    // Play sound every click? The prompt said "sound when reaching target"
    // But usually tasbeeh has a subtle feedback click
    if (target > 0 && nextCount === target) {
      playBeep();
      // Reset after a small delay or keep?
      // For now we just alert and vibrate if possible
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  const handleReset = () => {
    if (window.confirm("هل تريد إعادة العداد للصفر؟")) {
      setCount(0);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col items-center space-y-8 bg-gradient-to-b from-white to-emerald-50">
      {/* Controls */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-bold block">التسبيح:</label>
          <select 
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-emerald-800"
          >
            {TASBEEHAT.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-bold block">العدد المستهدف:</label>
          <select 
            value={target}
            onChange={(e) => {
              setTarget(Number(e.target.value));
              setCount(0);
            }}
            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-emerald-800"
          >
            {TASBEEH_TARGETS.map(t => (
              <option key={t} value={t}>{t === 0 ? 'مفتوح' : t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Display */}
      <div className="text-center py-4 px-6 bg-white rounded-3xl shadow-inner border border-emerald-100 min-w-[200px]">
        <h2 className="text-2xl font-amiri text-emerald-700 font-bold mb-2">{phrase}</h2>
        {target > 0 && (
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-gray-400 text-xs font-bold">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{count}</span>
            <span>/</span>
            <span>{target}</span>
          </div>
        )}
      </div>

      {/* Main Button */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <button
          onClick={handleIncrement}
          className="relative group active:scale-95 transition-transform duration-75"
        >
          {/* Ring decoration */}
          <div className="absolute inset-0 -m-4 border-4 border-emerald-200 rounded-full animate-pulse"></div>
          
          <div className="w-48 h-48 bg-emerald-600 rounded-full shadow-[0_20px_50px_rgba(5,150,105,0.3)] flex flex-col items-center justify-center text-white border-8 border-emerald-500 z-10 relative">
            <span className="text-6xl font-bold font-mono tracking-tighter">{count}</span>
            <span className="text-sm font-bold mt-2 opacity-80 uppercase">انقر للتسبيح</span>
          </div>
        </button>
      </div>

      {/* Bottom Tools */}
      <div className="w-full flex justify-between items-center px-4">
        <button 
          onClick={handleReset}
          className="p-4 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <RotateCcw size={28} />
        </button>
        
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-4 rounded-full shadow-sm transition-colors ${soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}
        >
          {soundEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
        </button>
      </div>
    </div>
  );
};

export default Tasbeeh;
