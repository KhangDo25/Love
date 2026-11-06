export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  avatar: string; // emoji or base64 or url
  anniversaryDate: string; // YYYY-MM-DD
  myBirthday: string; // YYYY-MM-DD
  partnerBirthday: string; // YYYY-MM-DD
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'text' | 'reaction' | 'pickup';
}

export interface BucketItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: number;
  addedBy: string;
}

export interface LoveLetter {
  id: string;
  senderId: string;
  senderName: string;
  title: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: string;
  authorName: string;
  timestamp: number;
}

export interface LikesDislikes {
  myLikes: string[];
  myDislikes: string[];
  partnerLikes: string[];
  partnerDislikes: string[];
}

export interface RPSRound {
  hostChoice: 'rock' | 'paper' | 'scissors' | null;
  guestChoice: 'rock' | 'paper' | 'scissors' | null;
  roundNumber: number;
  winner: 'host' | 'guest' | 'draw' | null;
  penalty: string | null;
}

export interface DrawStroke {
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

export interface WheelState {
  spinning: boolean;
  targetAngle: number;
  selectedOption: string | null;
  spunBy: string | null;
  timestamp: number;
}

export interface UnderstandingQuizState {
  step: 'waiting' | 'answering' | 'revealed';
  currentQuestionIndex: number;
  // Map question index to answers
  hostAnswers: Record<number, string>;
  guestAnswers: Record<number, string>;
  matchCount: number;
}

export interface QuickQAState {
  currentQuestionIndex: number;
  hostAnswer: string | null;
  guestAnswer: string | null;
  revealed: boolean;
}

export interface CoupleCourtCase {
  id: string;
  plaintiff: string; // Who filed the complaint
  defendant: string; // Accused
  title: string;
  situation: string;
  verdict: 'guilty' | 'innocent' | 'pending';
  penalty: string | null;
  votedBy: string | null;
  timestamp: number;
}

// Master state synced between players
export interface CoupleGameState {
  roomCode: string;
  isHost: boolean;
  lovePoints: number;
  hostProfile: UserProfile | null;
  guestProfile: UserProfile | null;
  chatMessages: ChatMessage[];
  bucketList: BucketItem[];
  letters: LoveLetter[];
  diaries: DiaryEntry[];
  likesDislikes: LikesDislikes;
  rps: RPSRound;
  rpsScore: { hostWins: number; guestWins: number; draws: number };
  wheelState: WheelState;
  understandingQuiz: UnderstandingQuizState;
  quickQA: QuickQAState;
  courtCases: CoupleCourtCase[];
  drawingStrokes: DrawStroke[];
  lastUpdated: number;
}

// PeerJS data message protocol
export type P2PMessage =
  | { type: 'SYNC_FULL_STATE'; payload: CoupleGameState }
  | { type: 'UPDATE_PROFILE'; payload: { role: 'host' | 'guest'; profile: UserProfile } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_LOVE_POINTS'; payload: { points: number; reason?: string } }
  | { type: 'UPDATE_BUCKET_LIST'; payload: BucketItem[] }
  | { type: 'ADD_LETTER'; payload: LoveLetter }
  | { type: 'MARK_LETTER_READ'; payload: { letterId: string } }
  | { type: 'ADD_DIARY'; payload: DiaryEntry }
  | { type: 'UPDATE_LIKES_DISLIKES'; payload: LikesDislikes }
  | { type: 'RPS_MOVE'; payload: { role: 'host' | 'guest'; choice: 'rock' | 'paper' | 'scissors' } }
  | { type: 'RPS_RESET'; payload: { penalty?: string } }
  | { type: 'SPIN_WHEEL'; payload: WheelState }
  | { type: 'DRAW_STROKE'; payload: DrawStroke }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'QUIZ_SUBMIT_ANSWER'; payload: { role: 'host' | 'guest'; questionIndex: number; answer: string } }
  | { type: 'QUIZ_NEXT_QUESTION'; payload: number }
  | { type: 'QUIZ_RESTART' }
  | { type: 'QUICK_QA_ANSWER'; payload: { role: 'host' | 'guest'; answer: string } }
  | { type: 'QUICK_QA_NEXT'; payload: number }
  | { type: 'COURT_ADD_CASE'; payload: CoupleCourtCase }
  | { type: 'COURT_VOTE'; payload: { caseId: string; verdict: 'guilty' | 'innocent'; penalty: string } }
  | { type: 'REJECT_ROOM_FULL'; payload: { reason: string } }
  | { type: 'PING' }
  | { type: 'PONG' };
