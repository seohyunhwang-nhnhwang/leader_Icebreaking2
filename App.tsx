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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-x-hidden">
      {state === AppState.HOME ? (
        <div className="text-center flex flex-col items-center animate-in fade-in duration-1000">
          <div className="mb-12">
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
            className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 active:scale-95 text-lg"
          >
            카드 뽑기 시작
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-6xl flex flex-col items-center">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">지금 나의 상태는 어떤가요?</h2>
            <p className="text-slate-400">마음이 머무는 카드를 하나 선택해주세요.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch">
            {currentCards.map((card, index) => (
              <div 
                key={`${card.id}-${index}`}
                onClick={() => handleSelectCard(card.id)}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`
                  relative flex flex-col items-center justify-center text-center cursor-pointer bg-white rounded-[2.5rem] shadow-xl p-8 transition-all duration-500 transform border-4 aspect-[3/4.5]
                  ${isAnimating ? 'scale-90 opacity-0 -translate-y-4' : 'scale-100 opacity-100 translate-y-0'}
                  ${selectedCardId === card.id ? 'border-indigo-400 ring-4 ring-indigo-50 shadow-indigo-100 scale-105 z-20' : 'border-transparent hover:border-slate-100 hover:shadow-2xl hover:-translate-y-2'}
                `}
              >
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.2rem] pointer-events-none opacity-40">
                  <div className="absolute top-[-5%] right-[-5%] w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-rose-50 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full items-center justify-between py-2">
                  <div className={`text-6xl mb-4 transition-transform duration-500 ${selectedCardId === card.id ? 'scale-125' : ''}`}>
                    {card.emoji}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest mb-3 opacity-80">
                      {card.title}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug break-keep px-2">
                      {card.text}
                    </h3>
                  </div>

                  <div className={`w-12 h-1 rounded-full mt-6 transition-colors duration-300 ${selectedCardId === card.id ? 'bg-indigo-400' : 'bg-slate-100'}`}></div>
                </div>
              </div>
            ))}

            <div
              onClick={handleReroll}
              className={`
                group relative flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900 rounded-[2.5rem] shadow-xl p-8 transition-all duration-500 transform border-4 border-slate-800 aspect-[3/4.5] hover:bg-slate-800 active:scale-95 overflow-hidden
                ${isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="text-5xl mb-6 text-white group-hover:rotate-[360deg] transition-transform duration-700">🔄</div>
                <span className="text-indigo-400 font-bold text-sm tracking-widest mb-2 uppercase">Another Try</span>
                <h2 className="text-2xl font-bold text-white">다시 뽑기</h2>
                <p className="text-slate-500 text-sm mt-4">다른 고민이 있나요?</p>
              </div>
            </div>
          </div>

          <div className={`mt-10 w-full max-w-2xl transition-all duration-700 transform ${selectedCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="bg-white/80 backdrop-blur-md border border-indigo-100 p-8 rounded-[2rem] shadow-lg text-center">
              <p className="text-indigo-600 font-bold text-lg mb-2">"{selectedCard?.title}"의 무게를 지고 계시군요.</p>
              <p className="text-slate-600 text-lg leading-relaxed break-keep">
                리더님, 혼자서 너무 애쓰고 계신 건 아닌가요? <br/>
                가끔은 이 막막함과 피로함이 당연한 것일지도 모릅니다.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            <button
              onClick={handleGoHome}
              className="px-8 py-3 rounded-full font-semibold text-slate-400 hover:text-indigo-600 hover:bg-white transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              처음으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;