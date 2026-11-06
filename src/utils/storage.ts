import {
  CoupleGameState,
  UserProfile,
  ChatMessage,
  BucketItem,
  LoveLetter,
  DiaryEntry,
  LikesDislikes,
} from '../types/game';
import { DEFAULT_BUCKET_LIST } from './questions';

const STORAGE_KEY = 'tycct_couple_game_v1';
const PROFILE_KEY = 'tycct_my_profile_v1';
const LAST_ROOM_KEY = 'tycct_last_room_code';

export function getDefaultProfile(): UserProfile {
  return {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    name: '',
    gender: 'female',
    avatar: '🐰',
    anniversaryDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 100 days ago
    myBirthday: '2001-05-20',
    partnerBirthday: '2000-11-15',
    updatedAt: Date.now(),
  };
}

export function loadSavedProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return { ...getDefaultProfile(), ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load profile from storage', e);
  }
  return getDefaultProfile();
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to storage', e);
  }
}

export function getLastRoomCode(): string | null {
  try {
    return localStorage.getItem(LAST_ROOM_KEY);
  } catch {
    return null;
  }
}

export function saveLastRoomCode(code: string | null): void {
  try {
    if (code) {
      localStorage.setItem(LAST_ROOM_KEY, code);
    } else {
      localStorage.removeItem(LAST_ROOM_KEY);
    }
  } catch (e) {
    console.error('Failed to save last room code', e);
  }
}

export function getDefaultGameState(roomCode: string, isHost: boolean): CoupleGameState {
  const initialBucket: BucketItem[] = DEFAULT_BUCKET_LIST.map((text, idx) => ({
    id: `bucket_${idx}`,
    text,
    completed: idx < 2, // First 2 completed as lovely default
    completedAt: Date.now(),
    addedBy: 'Cả hai',
  }));

  return {
    roomCode,
    isHost,
    lovePoints: 200,
    hostProfile: null,
    guestProfile: null,
    chatMessages: [
      {
        id: 'msg_welcome',
        senderId: 'system',
        senderName: 'Hệ thống 💌',
        text: 'Chào mừng 2 bạn đến với GAME CỦA 2 CHÚNG MÌNH 💕 Chúc hai bạn chơi vui vẻ và yêu nhau nhiều hơn mỗi ngày!',
        timestamp: Date.now(),
        type: 'text',
      },
    ],
    bucketList: initialBucket,
    letters: [
      {
        id: 'welcome_letter',
        senderId: 'system',
        senderName: 'Trợ lý Tình Yêu 💌',
        title: 'Bức thư mở đầu câu chuyện 💕',
        content:
          'Gửi hai bạn đáng yêu!\n\nChào mừng hai bạn đến với không gian bí mật chỉ dành riêng cho hai người. Hãy cùng nhau trả lời các câu hỏi, chinh phục các thử thách, gửi thư tình lãng mạn và tạo nên thật nhiều kỷ niệm đẹp tại đây nhé!\n\nMỗi lần chơi game hoặc tương tác, thanh "Độ yêu" sẽ được cộng điểm đấy!',
        timestamp: Date.now(),
        read: false,
      },
    ],
    diaries: [
      {
        id: 'diary_init',
        title: 'Ngày đầu tiên mở Web Game đôi',
        content: 'Hai đứa chính thức kết nối điện thoại và cùng nhau tạo phòng chơi game tình yêu 💕',
        date: new Date().toISOString().split('T')[0],
        tag: 'Kỷ niệm 💕',
        authorName: 'Hai đứa',
        timestamp: Date.now(),
      },
    ],
    likesDislikes: {
      myLikes: ['Trà sữa trân châu', 'Được ôm lúc ngủ', 'Đi ăn lẩu cuối tuần'],
      myDislikes: ['Bị người yêu lơ tin nhắn', 'Thời tiết nóng nực', 'Thức ăn nguội'],
      partnerLikes: ['Được khen đẹp trai/xinh gái', 'Món nướng BBQ', 'Chơi game cùng nhau'],
      partnerDislikes: ['Bị đánh thức lúc đang ngủ say', 'Ăn hành lá', 'Cãi nhau qua tin nhắn'],
    },
    rps: {
      hostChoice: null,
      guestChoice: null,
      roundNumber: 1,
      winner: null,
      penalty: null,
    },
    rpsScore: { hostWins: 0, guestWins: 0, draws: 0 },
    wheelState: {
      spinning: false,
      targetAngle: 0,
      selectedOption: null,
      spunBy: null,
      timestamp: Date.now(),
    },
    understandingQuiz: {
      step: 'waiting',
      currentQuestionIndex: 0,
      hostAnswers: {},
      guestAnswers: {},
      matchCount: 0,
    },
    quickQA: {
      currentQuestionIndex: 0,
      hostAnswer: null,
      guestAnswer: null,
      revealed: false,
    },
    courtCases: [],
    drawingStrokes: [],
    lastUpdated: Date.now(),
  };
}

// Merge state seamlessly so no data is ever lost across restarts or reconnections
export function mergeGameStates(current: CoupleGameState, incoming: CoupleGameState): CoupleGameState {
  // Merge Chat Messages
  const msgMap = new Map<string, ChatMessage>();
  [...current.chatMessages, ...incoming.chatMessages].forEach((m) => {
    msgMap.set(m.id, m);
  });
  const mergedMessages = Array.from(msgMap.values()).sort((a, b) => a.timestamp - b.timestamp);

  // Merge Bucket List: prioritize true completion, include all unique items
  const bucketMap = new Map<string, BucketItem>();
  [...current.bucketList, ...incoming.bucketList].forEach((item) => {
    const existing = bucketMap.get(item.id);
    if (!existing) {
      bucketMap.set(item.id, item);
    } else {
      bucketMap.set(item.id, {
        ...existing,
        ...item,
        completed: existing.completed || item.completed,
      });
    }
  });

  // Merge Letters
  const letterMap = new Map<string, LoveLetter>();
  [...current.letters, ...incoming.letters].forEach((l) => {
    const existing = letterMap.get(l.id);
    if (!existing) {
      letterMap.set(l.id, l);
    } else {
      letterMap.set(l.id, {
        ...existing,
        ...l,
        read: existing.read || l.read,
      });
    }
  });

  // Merge Diaries
  const diaryMap = new Map<string, DiaryEntry>();
  [...current.diaries, ...incoming.diaries].forEach((d) => {
    diaryMap.set(d.id, d);
  });
  const mergedDiaries = Array.from(diaryMap.values()).sort((a, b) => b.timestamp - a.timestamp);

  // Merge Likes & Dislikes
  const mergeLists = (a: string[] = [], b: string[] = []) => Array.from(new Set([...a, ...b]));

  const mergedLikesDislikes: LikesDislikes = {
    myLikes: mergeLists(current.likesDislikes?.myLikes, incoming.likesDislikes?.myLikes),
    myDislikes: mergeLists(current.likesDislikes?.myDislikes, incoming.likesDislikes?.myDislikes),
    partnerLikes: mergeLists(current.likesDislikes?.partnerLikes, incoming.likesDislikes?.partnerLikes),
    partnerDislikes: mergeLists(current.likesDislikes?.partnerDislikes, incoming.likesDislikes?.partnerDislikes),
  };

  // Merge Court cases
  const caseMap = new Map<string, (typeof current.courtCases)[0]>();
  [...current.courtCases, ...incoming.courtCases].forEach((c) => {
    caseMap.set(c.id, c);
  });

  // Host takes priority for active game ephemeral states (RPS, Quiz, QA) if incoming is from Host
  const rps = incoming.isHost ? incoming.rps : current.rps;
  const understandingQuiz = incoming.isHost ? incoming.understandingQuiz : current.understandingQuiz;
  const quickQA = incoming.isHost ? incoming.quickQA : current.quickQA;
  const wheelState = incoming.wheelState.timestamp > current.wheelState.timestamp ? incoming.wheelState : current.wheelState;

  return {
    ...current,
    lovePoints: Math.max(current.lovePoints || 0, incoming.lovePoints || 0),
    hostProfile: incoming.hostProfile || current.hostProfile,
    guestProfile: incoming.guestProfile || current.guestProfile,
    chatMessages: mergedMessages,
    bucketList: Array.from(bucketMap.values()),
    letters: Array.from(letterMap.values()),
    diaries: mergedDiaries,
    likesDislikes: mergedLikesDislikes,
    rps,
    rpsScore: {
      hostWins: Math.max(current.rpsScore.hostWins, incoming.rpsScore.hostWins),
      guestWins: Math.max(current.rpsScore.guestWins, incoming.rpsScore.guestWins),
      draws: Math.max(current.rpsScore.draws, incoming.rpsScore.draws),
    },
    wheelState,
    understandingQuiz,
    quickQA,
    courtCases: Array.from(caseMap.values()),
    drawingStrokes: incoming.drawingStrokes.length > current.drawingStrokes.length ? incoming.drawingStrokes : current.drawingStrokes,
    lastUpdated: Date.now(),
  };
}

export function loadSavedGameState(roomCode: string, isHost: boolean): CoupleGameState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${roomCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return mergeGameStates(getDefaultGameState(roomCode, isHost), parsed);
    }
  } catch (e) {
    console.error('Failed to load game state', e);
  }
  return getDefaultGameState(roomCode, isHost);
}

export function saveGameState(state: CoupleGameState): void {
  try {
    if (state.roomCode) {
      localStorage.setItem(`${STORAGE_KEY}_${state.roomCode}`, JSON.stringify(state));
    }
  } catch (e) {
    console.error('Failed to save game state', e);
  }
}
