export type StatementChoice = 'A' | 'B' | 'C';

export interface StatementSubmission {
  statementA: string;
  statementB: string;
  statementC: string;
  lieIndex: StatementChoice;
  submittedAt: number;
}

export interface StatementChoiceHidden {
  statementA: string;
  statementB: string;
  statementC: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  submitted: boolean;
  submission?: StatementSubmission; // Present on server / host when authorized, hidden from general student state
  hasVotedCurrentRound?: boolean;
  streak: number;
  isHost?: boolean;
}

export interface RoundData {
  roundIndex: number;
  presenterStudentId: string;
  presenterName: string;
  statements: { A: string; B: string; C: string };
  lieIndex: StatementChoice | null; // null during voting, populated upon reveal
  votes: Record<string, StatementChoice>; // voterId -> Choice
  status: 'voting' | 'revealed';
  startTime: number;
  revealTime?: number;
  deceptionPointsEarned?: number;
  fooledCount?: number;
  totalVoters?: number;
}

export type GameStatus = 'lobby' | 'submitting' | 'playing' | 'ended';

export interface PublicGameRoom {
  pin: string;
  status: GameStatus;
  players: Omit<Player, 'submission'>[]; // Public view without secret lieIndex
  currentRound: RoundData | null;
  completedPresenterIds: string[];
  totalPresenters: number;
  createdAt: number;
}

export interface FullGameRoom extends PublicGameRoom {
  players: Player[]; // Full player view for teacher/server
}

export interface ScoreGain {
  studentId: string;
  pointsGained: number;
  isCorrect: boolean;
  newScore: number;
  newStreak: number;
}

export interface RoundResultPayload {
  round: RoundData;
  scoreGains: Record<string, ScoreGain>;
  deceptionBonus: {
    studentId: string;
    studentName: string;
    points: number;
    fooledCount: number;
  } | null;
  leaderboard: { id: string; name: string; score: number; rank: number }[];
}
