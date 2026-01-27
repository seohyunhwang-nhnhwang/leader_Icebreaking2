
import React, { useState, useCallback } from 'react';
import { AppState, Card } from './types';
import { REFLECTION_CARDS } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const getRandomCards = useCallback((count: number) => {
    const shuffled = [...REFLECTION_CARDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);

  const handleStart = () => {
    const initialCards = getRandomCards(3);
    setCurrentCards(initialCards);
    setState(AppState.CARD);
    triggerAnimation();
  };

  const handleReroll = () => {
    const nextCards = getRandomCards(3);
    setCurrentCards(nextCards);
    triggerAnimation();
  };

  const handleGoHome = () => {
    setState(AppState.HOME);
    setCurrentCards([]);
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50 flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-x-hidden">
      {state === AppState.HOME ? (
        <div className="text-center animate-in fade-in duration-1000 flex flex-col items-center">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 tracking-tight">
              요즘 어때요?
            </h1>
            <p className="text-slate-500 text-lg md:text-xl">당신의 마음을 카드 세 장에 담아보았습니다.</p>
          </div>
          
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 active:scale-95 text-lg"
          >
            카드 뽑기
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-6xl flex flex-col items-center">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch">
            {currentCards.map((card, index) => (
              <div 
                key={`${card.id}-${index}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`
                  relative flex flex-col items-center justify-center text-center bg-white rounded-[2rem] shadow-xl p-8 transition-all duration-500 transform border border-slate-100 aspect-[3/4.5]
                  ${isAnimating ? 'scale-90 opacity-0 -translate-y-4' : 'scale-100 opacity-100 translate-y-0'}
                `}
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2rem] pointer-events-none opacity-40">
                  <div className="absolute top-[-5%] right-[-5%] w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-orange-50 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full items-center justify-between py-4">
                  <div className="text-5xl mb-4">{card.emoji}</div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest mb-2">
                      {card.title}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug break-keep px-2">
                      {card.text}
                    </h2>
                  </div>

                  <div className="w-12 h-1 bg-slate-100 rounded-full mt-6"></div>
                </div>
              </div>
            ))}

            {/* Reroll Button Styled as a Card */}
            <button
              onClick={handleReroll}
              disabled={isAnimating}
              className={`
                group relative flex flex-col items-center justify-center text-center bg-slate-800 rounded-[2rem] shadow-xl p-8 transition-all duration-500 transform border border-slate-700 aspect-[3/4.5] hover:bg-slate-700 active:scale-95 overflow-hidden
                ${isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="text-4xl mb-4 text-white group-hover:rotate-180 transition-transform duration-500">🔄</div>
                <span className="text-indigo-300 font-bold text-sm tracking-widest mb-2 uppercase">Refresh</span>
                <h2 className="text-2xl font-bold text-white">다시 뽑기</h2>
                <p className="text-slate-400 text-sm mt-4">새로운 마음가짐</p>
              </div>
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <button
              onClick={handleGoHome}
              className="px-8 py-3 rounded-full font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              처음으로 돌아가기
            </button>
            
            <div className="text-slate-400 text-sm flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-slate-100 backdrop-blur-sm shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
              리더님의 오늘을 응원합니다
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
