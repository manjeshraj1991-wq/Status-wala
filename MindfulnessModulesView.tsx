import React, { useState, useEffect } from 'react';
import { MindfulnessModule } from '../types';
import { audioEngine } from '../services/audioSynthesizer';
import {
  Play,
  Pause,
  Volume2,
  Lock,
  Download,
  Check,
  Sparkles,
  Clock,
  Compass,
  Headphones,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface MindfulnessModulesViewProps {
  modules: MindfulnessModule[];
  isPremium: boolean;
  offlineDownloadedIds: string[];
  onToggleOfflineDownload: (moduleId: string) => void;
  onOpenSubscriptionModal: () => void;
}

export const MindfulnessModulesView: React.FC<MindfulnessModulesViewProps> = ({
  modules,
  isPremium,
  offlineDownloadedIds,
  onToggleOfflineDownload,
  onOpenSubscriptionModal,
}) => {
  const [activeModule, setActiveModule] = useState<MindfulnessModule | null>(modules[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(activeModule ? activeModule.durationMinutes * 60 : 420);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Sync timer when activeModule changes
  useEffect(() => {
    if (activeModule) {
      setTimerSecondsRemaining(activeModule.durationMinutes * 60);
      setIsTimerRunning(false);
      setCurrentStepIndex(0);
      if (isPlayingAudio) {
        audioEngine.stop();
        setIsPlayingAudio(false);
      }
    }
  }, [activeModule?.id]);

  // Audio volume change
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  // Countdown timer & breath phase cycle
  useEffect(() => {
    let timer: number;
    let breathTimer: number;

    if (isTimerRunning && timerSecondsRemaining > 0) {
      timer = window.setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev <= 1) {
            audioEngine.strikeBowl(300);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Breath circle 4s inhale, 4s hold, 6s exhale (14s cycle)
      breathTimer = window.setInterval(() => {
        const sec = Date.now() / 1000;
        const cycle = sec % 14;
        if (cycle < 4) setBreathPhase('Inhale');
        else if (cycle < 8) setBreathPhase('Hold');
        else setBreathPhase('Exhale');
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(breathTimer);
    };
  }, [isTimerRunning, timerSecondsRemaining]);

  const toggleAudio = (module: MindfulnessModule) => {
    const isLocked = module.isPremium && !isPremium;
    if (isLocked) {
      onOpenSubscriptionModal();
      return;
    }

    if (activeModule?.id !== module.id) {
      setActiveModule(module);
      audioEngine.play(module.ambientType);
      setIsPlayingAudio(true);
      setIsTimerRunning(true);
    } else {
      if (isPlayingAudio) {
        audioEngine.stop();
        setIsPlayingAudio(false);
        setIsTimerRunning(false);
      } else {
        audioEngine.play(module.ambientType);
        setIsPlayingAudio(true);
        setIsTimerRunning(true);
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>Offline-Ready</span>
            <span aria-hidden="true">·</span>
            <span>Synthesized Generative Audio</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif-newsreader font-normal text-stone-900 dark:text-stone-100">
            Curated Mindfulness & Sound Immersion
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xl">
            100% offline-functional meditations and real-time synthesized acoustic harmonics. No external server streaming required.
          </p>
        </div>

        {!isPremium && (
          <button
            onClick={onOpenSubscriptionModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-900 dark:text-amber-100 bg-amber-500/15 border border-amber-500/30 rounded-xl hover:bg-amber-500/25 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Unlock Sanctuary+ Premium</span>
          </button>
        )}
      </div>

      {/* Active Meditation Player (when a module is active) */}
      {activeModule && (
        <div className="p-6 md:p-8 bg-stone-900 text-stone-100 dark:bg-stone-950 dark:border dark:border-stone-800 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-mono text-stone-400">
                Active Session · {activeModule.ambientType.replace('-', ' ')}
              </span>
              <h3 className="text-xl font-serif-newsreader text-white">
                {activeModule.title}
              </h3>
              <p className="text-xs text-stone-400 max-w-md">
                {activeModule.subtitle}
              </p>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block font-mono text-2xl font-light text-stone-100">
                  {formatTimer(timerSecondsRemaining)}
                </span>
                <span className="text-[10px] uppercase font-mono text-stone-400">
                  {isTimerRunning ? `Breath: ${breathPhase}` : 'Session Paused'}
                </span>
              </div>

              <button
                onClick={() => toggleAudio(activeModule)}
                className="w-12 h-12 rounded-full bg-white text-stone-900 hover:bg-stone-200 flex items-center justify-center transition-all shadow-md active:scale-95"
                title={isPlayingAudio ? 'Pause session' : 'Begin session'}
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setTimerSecondsRemaining(activeModule.durationMinutes * 60);
                  audioEngine.strikeBowl(216);
                }}
                className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Visual Breathing Guide */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Animated breath ring */}
              <div
                className={`absolute inset-0 rounded-full border border-stone-700 transition-all duration-1000 ${
                  isTimerRunning ? 'animate-breathe' : 'opacity-30'
                }`}
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
                }}
              />
              <div className="text-center z-10 space-y-1">
                <span className="text-xs uppercase tracking-widest font-mono text-stone-400">
                  {isTimerRunning ? breathPhase : 'Ready'}
                </span>
                <p className="text-[11px] text-stone-500 font-mono">
                  {isTimerRunning ? (breathPhase === 'Inhale' ? '4s' : breathPhase === 'Hold' ? '4s' : '6s') : 'Press Play'}
                </p>
              </div>
            </div>

            {/* Current Step Guidance */}
            <div className="max-w-xl text-center px-4 space-y-2">
              <span className="text-[11px] text-stone-500 uppercase font-mono">
                Step {currentStepIndex + 1} of {activeModule.guideSteps.length}
              </span>
              <p className="text-sm font-serif-newsreader italic text-stone-200 leading-relaxed min-h-[44px]">
                &ldquo;{activeModule.guideSteps[currentStepIndex]}&rdquo;
              </p>

              {/* Step Navigation Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {activeModule.guideSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? 'w-6 bg-white'
                        : 'w-2 bg-stone-700 hover:bg-stone-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sound Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-stone-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-white cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <Headphones className="w-3.5 h-3.5" />
              <span>Headphones recommended for spatial acoustic resonance</span>
            </div>
          </div>
        </div>
      )}

      {/* Modules Library Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-stone-500" />
          Mindfulness Immersion Library
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const isDownloaded = offlineDownloadedIds.includes(module.id);
            const isLocked = module.isPremium && !isPremium;
            const isCurrentlyPlaying = activeModule?.id === module.id && isPlayingAudio;

            return (
              <div
                key={module.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  activeModule?.id === module.id
                    ? 'border-stone-900 dark:border-stone-100 bg-white dark:bg-stone-900 shadow-md ring-1 ring-stone-900/10 dark:ring-stone-100/10'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] uppercase font-mono text-stone-400">
                      {module.category} · {module.durationMinutes} MIN
                    </span>
                    {module.isPremium && (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Sparkles className="w-3 h-3" />
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-serif-newsreader font-medium text-stone-900 dark:text-stone-100">
                    {module.title}
                  </h4>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {module.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  {/* Offline Download Toggle */}
                  <button
                    onClick={() => onToggleOfflineDownload(module.id)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      isDownloaded
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                    title={isDownloaded ? 'Downloaded for offline use' : 'Save for offline access'}
                  >
                    {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{isDownloaded ? 'Offline Ready' : 'Download'}</span>
                  </button>

                  {/* Play / Unlock CTA */}
                  <button
                    onClick={() => toggleAudio(module)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      isLocked
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                        : isCurrentlyPlaying
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span>Unlock</span>
                      </>
                    ) : isCurrentlyPlaying ? (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Begin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
