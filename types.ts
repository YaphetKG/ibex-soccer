
export interface TeamEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  type: 'MATCH' | 'TRAINING' | 'SOCIAL';
}

export interface HistoryItem {
  id: number;
  title: string;
  description: string;
  year: string;
  type: 'TROPHY' | 'MOMENT';
  imageUrl?: string;
}

export interface RecruitProfile {
  name: string;
  position: string;
  favoritePlayer: string;
  experience: string;
}

export interface ScoutCard {
  generated: boolean;
  nickname: string;
  stats: {
    speed: number;
    power: number;
    technique: number;
  };
  description: string;
}

export enum ViewState {
  HOME = 'HOME',
  EVENTS = 'EVENTS',
  RECRUIT = 'RECRUIT',
  TACTICS = 'TACTICS',
  KIT_GEN = 'KIT_GEN',
  CHANTS = 'CHANTS',
  HISTORY = 'HISTORY',
  ADMIN = 'ADMIN'
}
