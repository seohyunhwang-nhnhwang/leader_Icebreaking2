
export interface Card {
  id: number;
  title: string;
  text: string;
  emoji: string;
}

export enum AppState {
  HOME = 'HOME',
  CARD = 'CARD'
}
