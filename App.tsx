import React, { useState, useCallback } from 'react';
import { AppState, Card } from './types.ts';
import { REFLECTION_CARDS } from './constants.ts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const getRandomCards = useCallback((count: number) => {
    const shuffled = [...REFLECTION_CARDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);

  const handleStart = () => {
    const initialCards = getRandomCards(3);
    setCurrentCards(initialCards);
    setSelectedCardId(null);
    setState(AppState.CARD);
    triggerAnimation();
  };

  const handleReroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCards = getRandomCards(3);
    setCurrentCards(nextCards);
    setSelectedCardId(null);
    triggerAnimation();
  };

  const handleSelectCard = (id: number) => {
    if (selectedCardId === id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(id);
    }
  };

  const handleGoHome = () => {
    setState(AppState.HOME);
    setCurrentCards([]);
    setSelectedCardId(null);
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const selectedCard = currentCards.find(c => c.id === selectedCardId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex flex-col items-center justify-center px-3 py-6 sm:px-8 sm:py-12 select-none overflow-x-hidden font-sans">
      {state === AppState.HOME ? (
        <div className="text-center flex flex-col items-center animate-in fade-in duration-1000 slide-in-from-bottom-4">
          <div className="mb-12 px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
              요즘 어때요?
            </h1>
            <p className="text-slate-500 text-lg md:text-2xl max-w-lg mx-auto leading-relaxed">
              조금 지쳐있진 않나요? <br/>
              세 장의 카드 중 마음이 가는 하나를 골라보세요.
            </p>
          </div>
          
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center px-12 py-4 sm:px-14 sm:py-5 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-200 hover:bg-indigo-700 shadow-2xl hover:shadow-indigo-300 active:scale-95 text-xl"
          >
            카드 뽑기 시작
            <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="text-center mb-6 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-2">지금 나의 상태는?</h2>
            <p className="text-slate-400 text-xs sm:text-lg">마음이 머무는 카드를 하나 선택해주세요.</p>
          </div>

          {/* 2x2 Grid with controlled gaps and max-width to prevent overflow */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 w-full max-w-[420px] sm:max-w-none items-stretch px-1">
            {currentCards.map((card, index) => (
              <div 
                key={`${card.id}-${index}`}
                onClick={() => handleSelectCard(card.id)}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`
                  relative flex flex-col items-center justify-center text-center cursor-pointer bg-white rounded-[1.5rem] sm:rounded-[3rem] shadow-lg p-3 sm:p-8 transition-all duration-500 transform border-2 sm:border-4 aspect-[1/1.3]
                  ${isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
                  ${selectedCardId === card.id ? 'border-indigo-500 ring-2 sm:ring-8 ring-indigo-50 shadow-indigo-100 scale-[1.03] z-20' : 'border-transparent hover:border-slate-100 hover:shadow-2xl hover:-translate-y-1'}
                `}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 overflow-hidden rounded-[1.3rem] sm:rounded-[2.8rem] pointer-events-none opacity-30">
                  <div className="absolute top-[-20%] right-[-20%] w-20 h-20 sm:w-40 sm:h-40 bg-indigo-50 rounded-full blur-xl sm:blur-2xl"></div>
                  <div className="absolute bottom-[-20%] left-[-20%] w-20 h-20 sm:w-40 sm:h-40 bg-rose-50 rounded-full blur-xl sm:blur-2xl"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full w-full items-center justify-between py-2">
                  {/* Emoji Section - Optimized size for small boxes */}
                  <div className={`text-4xl sm:text-7xl transition-transform duration-700 mt-1 ${selectedCardId === card.id ? 'scale-125 rotate-3' : ''}`}>
                    {card.emoji}
                  </div>
                  
                  {/* Text Section - Adjusted font sizes for 2x2 layout */}
                  <div className="flex flex-col items-center w-full px-1">
                    <span className="text-indigo-600 font-extrabold text-[8px] sm:text-xs uppercase tracking-[0.15em] mb-1 opacity-70">
                      {card.title}
                    </span>
                    <h3 className="text-[12px] sm:text-lg md:text-xl font-bold text-slate-800 leading-tight break-keep overflow-hidden text-ellipsis line-clamp-2">
                      {card.text}
                    </h3>
                  </div>

                  {/* Indicator Line */}
                  <div className={`w-6 sm:w-14 h-1 sm:h-1.5 rounded-full transition-all duration-500 ${selectedCardId === card.id ? 'bg-indigo-500 w-10 sm:w-20' : 'bg-slate-100'}`}></div>
                </div>
              </div>
            ))}

            <div
              onClick={handleReroll}
              className={`
                group relative flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900 rounded-[1.5rem] sm:rounded-[3rem] shadow-lg p-3 sm:p-8 transition-all duration-500 transform border-2 sm:border-4 border-slate-800 aspect-[1/1.3] hover:bg-slate-800 active:scale-95 overflow-hidden
                ${isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-6xl mb-2 sm:mb-4 text-white group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out">🔄</div>
                <span className="text-indigo-400 font-bold text-[8px] sm:text-xs tracking-widest mb-0.5 uppercase opacity-70">Reroll</span>
                <h2 className="text-[12px] sm:text-xl font-bold text-white leading-tight">다시 뽑기</h2>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className={`mt-8 sm:mt-16 w-full max-w-2xl transition-all duration-700 transform px-1 ${selectedCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
            <div className="bg-white/95 backdrop-blur-xl border-2 border-indigo-100 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
              <p className="text-indigo-600 font-black text-sm sm:text-2xl mb-3 sm:mb-4">
                "{selectedCard?.title}"의 무게를 지고 계시군요.
              </p>
              <p className="text-slate-700 text-xs sm:text-xl font-medium leading-relaxed break-keep">
                리더님, 오늘 하루도 참 고생 많으셨습니다. <br className="hidden sm:block"/>
                이 막막함은 당신이 책임을 다하고 있다는 증거입니다. <br className="hidden sm:block"/>
                잠시 숨을 고르며 당신의 마음부터 돌봐주세요.
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-16 mb-6">
            <button
              onClick={handleGoHome}
              className="px-8 py-3 rounded-full font-bold text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-[11px] sm:text-lg border-2 border-transparent hover:border-indigo-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              처음으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;