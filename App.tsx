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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex flex-col items-center justify-center px-4 py-6 sm:p-8 select-none overflow-x-hidden">
      {state === AppState.HOME ? (
        <div className="text-center flex flex-col items-center animate-in fade-in duration-1000">
          <div className="mb-12 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 tracking-tight">
              요즘 어때요?
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
              조금 지쳐있진 않나요? <br/>
              세 장의 카드 중 마음이 가는 하나를 골라보세요.
            </p>
          </div>
          
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center px-10 py-4 sm:px-12 sm:py-5 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 active:scale-95 text-lg"
          >
            카드 뽑기 시작
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="text-center mb-6 sm:mb-10 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">지금 나의 상태는 어떤가요?</h2>
            <p className="text-slate-400 text-xs sm:text-base">마음이 머무는 카드를 선택해주세요.</p>
          </div>

          {/* 모바일에서 겹침 방지를 위해 gap-3과 px-0 적용, 가로 너비 보장 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full items-stretch max-w-md lg:max-w-none">
            {currentCards.map((card, index) => (
              <div 
                key={`${card.id}-${index}`}
                onClick={() => handleSelectCard(card.id)}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`
                  relative flex flex-col items-center justify-center text-center cursor-pointer bg-white rounded-[1.2rem] sm:rounded-[2.5rem] shadow-md sm:shadow-xl p-3 sm:p-6 transition-all duration-500 transform border-2 sm:border-4 aspect-[4/5.2] sm:aspect-[3/4.2]
                  ${isAnimating ? 'scale-95 opacity-0 -translate-y-2' : 'scale-100 opacity-100 translate-y-0'}
                  ${selectedCardId === card.id ? 'border-indigo-400 ring-2 sm:ring-4 ring-indigo-50 shadow-indigo-100 scale-[1.02] z-20' : 'border-transparent hover:border-slate-100 hover:shadow-2xl'}
                `}
              >
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[1rem] sm:rounded-[2.2rem] pointer-events-none opacity-20 sm:opacity-40">
                  <div className="absolute top-[-10%] right-[-10%] w-16 h-16 sm:w-32 sm:h-32 bg-indigo-50 rounded-full blur-xl sm:blur-2xl"></div>
                  <div className="absolute bottom-[-10%] left-[-10%] w-16 h-16 sm:w-32 sm:h-32 bg-rose-50 rounded-full blur-xl sm:blur-2xl"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full w-full items-center justify-between py-1 sm:py-2">
                  <div className={`text-3xl sm:text-5xl mb-1 sm:mb-4 transition-transform duration-500 ${selectedCardId === card.id ? 'scale-110' : ''}`}>
                    {card.emoji}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center w-full overflow-hidden">
                    <span className="text-indigo-500 font-bold text-[8px] sm:text-[10px] uppercase tracking-wider mb-0.5 sm:mb-2 opacity-70">
                      {card.title}
                    </span>
                    <h3 className="text-[11px] sm:text-base md:text-lg font-bold text-slate-800 leading-normal sm:leading-snug break-keep px-1">
                      {card.text}
                    </h3>
                  </div>

                  <div className={`w-6 sm:w-10 h-0.5 sm:h-1 rounded-full mt-2 sm:mt-4 transition-colors duration-300 ${selectedCardId === card.id ? 'bg-indigo-400' : 'bg-slate-100'}`}></div>
                </div>
              </div>
            ))}

            <div
              onClick={handleReroll}
              className={`
                group relative flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900 rounded-[1.2rem] sm:rounded-[2.5rem] shadow-md sm:shadow-xl p-3 sm:p-6 transition-all duration-500 transform border-2 sm:border-4 border-slate-800 aspect-[4/5.2] sm:aspect-[3/4.2] hover:bg-slate-800 active:scale-95 overflow-hidden
                ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-5xl mb-2 sm:mb-4 text-white group-hover:rotate-[360deg] transition-transform duration-700">🔄</div>
                <span className="text-indigo-400 font-bold text-[8px] sm:text-[10px] tracking-wider mb-0.5 sm:mb-1 uppercase">Refresh</span>
                <h2 className="text-[13px] sm:text-xl font-bold text-white">다시 뽑기</h2>
              </div>
            </div>
          </div>

          <div className={`mt-8 w-full max-w-lg transition-all duration-700 transform px-2 ${selectedCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="bg-white/90 backdrop-blur-md border border-indigo-50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-lg text-center">
              <p className="text-indigo-600 font-bold text-sm sm:text-lg mb-1.5">"{selectedCard?.title}"의 무게를 지고 계시군요.</p>
              <p className="text-slate-600 text-[13px] sm:text-base leading-relaxed break-keep">
                리더님, 혼자서 너무 애쓰고 계신 건 아닌가요? <br className="hidden sm:block"/>
                가끔은 이 막막함과 피로함이 당연한 것일지도 모릅니다.
              </p>
            </div>
          </div>

          <div className="mt-8 mb-4">
            <button
              onClick={handleGoHome}
              className="px-6 py-2 rounded-full font-semibold text-slate-400 hover:text-indigo-600 hover:bg-white transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              처음으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;