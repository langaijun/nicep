export type UserState = 'noisy' | 'empty' | 'busy' | 'okay';

export type PathType = 'accept' | 'spark' | '';

export type ScreenId =
  | 'home'
  | 'anchor'
  | 'allow'
  | 'accept-narrative'
  | 'spark'
  | 'spark-body'
  | 'breakdown'
  | 'done'
  | 'socratic'
  | 'exit'
  | 'stay'
  | 'words-wall';

export interface SessionData {
  state: UserState | '';
  acceptText: string;
  sparkText: string;
  sparkBodyText: string;
  socraticText: string;
  done: boolean;
  timestamp: number | null;
}

export interface MemoryRecord {
  text: string;
  date: string;
  path: 'accept' | 'spark';
  socratic?: string;
}

export interface AnchorPoint {
  id: string;
  text: string;
  subtext: string;
}
