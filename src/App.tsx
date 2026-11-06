/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CoupleGameState,
  UserProfile,
  ChatMessage,
  DrawStroke,
  WheelState,
  CoupleCourtCase,
  LoveLetter,
  BucketItem,
  LikesDislikes,
  DiaryEntry,
  P2PMessage,
} from './types/game';
import {
  loadSavedProfile,
  saveProfile,
  loadSavedGameState,
  saveGameState,
  saveLastRoomCode,
  getLastRoomCode,
  getDefaultGameState,
  mergeGameStates,
} from './utils/storage';
import { MQTTManager, ConnectionStatus } from './utils/mqtt';
import { Header } from './components/Header';
import { Lobby } from './components/Lobby';
import { MainDashboard } from './components/MainDashboard';
import { ProfileModal } from './components/ProfileModal';
import { LoveFortune } from './components/LoveFortune';
import { ChatDrawer } from './components/ChatDrawer';
import { SweetModeHub } from './components/SweetMode/SweetModeHub';
import { BanterModeHub } from './components/BanterMode/BanterModeHub';
import { NotebookHub } from './components/Notebook/NotebookHub';
import { SharedHub } from './components/SharedFeatures/SharedHub';
import FloatingHearts from './components/FloatingHearts';

type ActiveView = 'main' | 'sweet' | 'banter' | 'notebook' | 'shared';

export default function App() {
  // Profiles
  const [myProfile, setMyProfile] = useState<UserProfile>(() => loadSavedProfile());
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);

  // Connection State
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [waitingCode, setWaitingCode] = useState('');
  const [currentRoomCode, setCurrentRoomCode] = useState<string | null>(null);
  const [lastRoomCode, setLastRoomCode] = useState<string | null>(() => getLastRoomCode());

  // Master Game State
  const [gameState, setGameState] = useState<CoupleGameState>(() =>
    getDefaultGameState('', false)
  );

  // Views & Modals
  const [activeView, setActiveView] = useState<ActiveView>('main');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFortuneModal, setShowFortuneModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // MQTT Manager reference
  const mqttRef = useRef<MQTTManager | null>(null);
  const gameStateRef = useRef<CoupleGameState>(gameState);
  gameStateRef.current = gameState;

  const myProfileRef = useRef<UserProfile>(myProfile);
  myProfileRef.current = myProfile;

  // Handle incoming P2P messages
  const handleP2PMessage = useCallback((msg: P2PMessage) => {
    switch (msg.type) {
      case 'SYNC_FULL_STATE': {
        const merged = mergeGameStates(gameStateRef.current, msg.payload);
        setGameState(merged);
        saveGameState(merged);

        // Update partner profile from incoming state
        if (merged.isHost) {
          if (merged.guestProfile) setPartnerProfile(merged.guestProfile);
        } else {
          if (merged.hostProfile) setPartnerProfile(merged.hostProfile);
        }
        break;
      }

      case 'UPDATE_PROFILE': {
        const { role, profile } = msg.payload;
        setPartnerProfile(profile);
        setGameState((prev) => {
          const next = {
            ...prev,
            hostProfile: role === 'host' ? profile : prev.hostProfile,
            guestProfile: role === 'guest' ? profile : prev.guestProfile,
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'ADD_CHAT_MESSAGE': {
        setGameState((prev) => {
          const next = {
            ...prev,
            chatMessages: [...prev.chatMessages, msg.payload],
          };
          saveGameState(next);
          return next;
        });
        setUnreadChatCount((prev) => prev + 1);
        break;
      }

      case 'ADD_LOVE_POINTS': {
        setGameState((prev) => {
          const next = {
            ...prev,
            lovePoints: (prev.lovePoints || 0) + msg.payload.points,
          };
          saveGameState(next);
          return next;
        });
        confetti({ particleCount: 30, spread: 60 });
        break;
      }

      case 'UPDATE_BUCKET_LIST': {
        setGameState((prev) => {
          const next = { ...prev, bucketList: msg.payload };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'ADD_LETTER': {
        setGameState((prev) => {
          const next = { ...prev, letters: [msg.payload, ...prev.letters] };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'MARK_LETTER_READ': {
        setGameState((prev) => {
          const next = {
            ...prev,
            letters: prev.letters.map((l) =>
              l.id === msg.payload.letterId ? { ...l, read: true } : l
            ),
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'ADD_DIARY': {
        setGameState((prev) => {
          const next = { ...prev, diaries: [msg.payload, ...prev.diaries] };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'UPDATE_LIKES_DISLIKES': {
        setGameState((prev) => {
          const next = { ...prev, likesDislikes: msg.payload };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'RPS_MOVE': {
        setGameState((prev) => {
          const { role, choice } = msg.payload;
          const nextRps = {
            ...prev.rps,
            hostChoice: role === 'host' ? choice : prev.rps.hostChoice,
            guestChoice: role === 'guest' ? choice : prev.rps.guestChoice,
          };

          // If both have chosen, determine winner and update score
          let hostWins = prev.rpsScore.hostWins;
          let guestWins = prev.rpsScore.guestWins;
          let draws = prev.rpsScore.draws;

          if (nextRps.hostChoice && nextRps.guestChoice) {
            if (nextRps.hostChoice === nextRps.guestChoice) {
              draws++;
              nextRps.winner = 'draw';
            } else if (
              (nextRps.hostChoice === 'rock' && nextRps.guestChoice === 'scissors') ||
              (nextRps.hostChoice === 'paper' && nextRps.guestChoice === 'rock') ||
              (nextRps.hostChoice === 'scissors' && nextRps.guestChoice === 'paper')
            ) {
              hostWins++;
              nextRps.winner = 'host';
            } else {
              guestWins++;
              nextRps.winner = 'guest';
            }
          }

          const next = {
            ...prev,
            rps: nextRps,
            rpsScore: { hostWins, guestWins, draws },
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'RPS_RESET': {
        setGameState((prev) => {
          const next = {
            ...prev,
            rps: {
              hostChoice: null,
              guestChoice: null,
              roundNumber: prev.rps.roundNumber + 1,
              winner: null,
              penalty: msg.payload.penalty || null,
            },
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'SPIN_WHEEL': {
        setGameState((prev) => {
          const next = { ...prev, wheelState: msg.payload };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'DRAW_STROKE': {
        setGameState((prev) => {
          const next = {
            ...prev,
            drawingStrokes: [...prev.drawingStrokes, msg.payload],
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'CLEAR_CANVAS': {
        setGameState((prev) => {
          const next = { ...prev, drawingStrokes: [] };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'QUIZ_SUBMIT_ANSWER': {
        setGameState((prev) => {
          const { role, questionIndex, answer } = msg.payload;
          const hostAnswers = { ...prev.understandingQuiz.hostAnswers };
          const guestAnswers = { ...prev.understandingQuiz.guestAnswers };

          if (role === 'host') {
            hostAnswers[questionIndex] = answer;
          } else {
            guestAnswers[questionIndex] = answer;
          }

          const next = {
            ...prev,
            understandingQuiz: {
              ...prev.understandingQuiz,
              hostAnswers,
              guestAnswers,
            },
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'QUIZ_NEXT_QUESTION': {
        setGameState((prev) => {
          const next = {
            ...prev,
            understandingQuiz: {
              ...prev.understandingQuiz,
              currentQuestionIndex: msg.payload,
            },
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'QUIZ_RESTART': {
        setGameState((prev) => {
          const next: CoupleGameState = {
            ...prev,
            understandingQuiz: {
              step: 'answering' as const,
              currentQuestionIndex: 0,
              hostAnswers: {},
              guestAnswers: {},
              matchCount: 0,
            },
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'QUICK_QA_ANSWER': {
        setGameState((prev) => {
          const { role, answer } = msg.payload;
          const hostAnswer = role === 'host' ? answer : prev.quickQA.hostAnswer;
          const guestAnswer = role === 'guest' ? answer : prev.quickQA.guestAnswer;
          const revealed = !!(hostAnswer && guestAnswer);

          const next = {
            ...prev,
            quickQA: {
              ...prev.quickQA,
              hostAnswer,
              guestAnswer,
              revealed,
            },
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'QUICK_QA_NEXT': {
        setGameState((prev) => {
          const next = {
            ...prev,
            quickQA: {
              currentQuestionIndex: msg.payload,
              hostAnswer: null,
              guestAnswer: null,
              revealed: false,
            },
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'COURT_ADD_CASE': {
        setGameState((prev) => {
          const next = {
            ...prev,
            courtCases: [msg.payload, ...prev.courtCases],
          };
          saveGameState(next);
          return next;
        });
        break;
      }

      case 'COURT_VOTE': {
        setGameState((prev) => {
          const { caseId, verdict, penalty } = msg.payload;
          const next = {
            ...prev,
            courtCases: prev.courtCases.map((c) =>
              c.id === caseId ? { ...c, verdict, penalty } : c
            ),
          };
          saveGameState(next);
          return next;
        });
        break;
      }
    }
  }, []);

  // Initialize MQTT manager
  useEffect(() => {
    mqttRef.current = new MQTTManager({
      onStatusChange: (status) => {
        console.log('[App] MQTT status change:', status);
        setConnectionStatus(status);
        if (status === 'connected') {
          setErrorMessage(null);
        }
      },
      onRoomCreated: (code) => {
        console.log('[App] Room created with code:', code);
        setWaitingCode(code);
      },
      onHandshakeComplete: (partnerProf, isHost, incomingState) => {
        console.log('[App] Handshake complete! isHost:', isHost, 'Partner:', partnerProf.name);
        setPartnerProfile(partnerProf);
        const room = mqttRef.current?.getRoomCode() || '';
        setCurrentRoomCode(room);
        saveLastRoomCode(room);
        setLastRoomCode(room);
        setErrorMessage(null);

        if (incomingState) {
          const merged = mergeGameStates(gameStateRef.current, incomingState);
          setGameState(merged);
          saveGameState(merged);
        } else {
          setGameState((prev) => {
            const next = {
              ...prev,
              roomCode: room,
              guestProfile: partnerProf,
              hostProfile: myProfileRef.current,
            };
            saveGameState(next);
            return next;
          });
        }

        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.5 },
        });
      },
      onPartnerDisconnected: () => {
        console.warn('[App] Partner disconnected! Heartbeat timeout > 15s');
      },
      onMessage: handleP2PMessage,
      onError: (err) => {
        console.error('[App] MQTT Error:', err);
        setErrorMessage(err);
      },
      getCurrentState: () => gameStateRef.current,
      getMyProfile: () => myProfileRef.current,
    });

    // Check for room in URL parameter ?room=1234
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam && roomParam.length === 4) {
      console.log('[App] Auto-joining room from URL query param:', roomParam);
      mqttRef.current.joinRoom(roomParam, myProfileRef.current);
    }

    return () => {
      mqttRef.current?.disconnect();
    };
  }, [handleP2PMessage]);

  // Host creates room
  const handleCreateRoom = () => {
    if (!mqttRef.current) return;
    setErrorMessage(null);
    mqttRef.current.createRoom();
  };

  // Guest joins room (only moves to room once handshake completes!)
  const handleJoinRoom = (code: string) => {
    if (!mqttRef.current) return;
    setErrorMessage(null);
    mqttRef.current.joinRoom(code, myProfileRef.current);
  };

  // Cancel waiting room / join attempt
  const handleCancelWait = () => {
    mqttRef.current?.disconnect();
    setWaitingCode('');
    setCurrentRoomCode(null);
    setErrorMessage(null);
  };

  // Leave room
  const handleLeaveRoom = () => {
    mqttRef.current?.disconnect();
    setCurrentRoomCode(null);
    setWaitingCode('');
    setErrorMessage(null);
    setActiveView('main');
  };

  // Profile save
  const handleSaveProfile = (updated: UserProfile) => {
    setMyProfile(updated);
    saveProfile(updated);

    // Send profile update to partner over MQTT
    if (mqttRef.current?.isConnected()) {
      mqttRef.current.send({
        type: 'UPDATE_PROFILE',
        payload: {
          role: mqttRef.current.getIsHost() ? 'host' : 'guest',
          profile: updated,
        },
      });
    }
  };

  // Chat message send
  const handleSendChatMessage = (
    text: string,
    type: 'text' | 'reaction' | 'pickup'
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: myProfile.id,
      senderName: myProfile.name || 'Người yêu',
      text,
      timestamp: Date.now(),
      type,
    };

    setGameState((prev) => {
      const next = {
        ...prev,
        chatMessages: [...prev.chatMessages, newMsg],
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'ADD_CHAT_MESSAGE',
      payload: newMsg,
    });
  };

  // Love points
  const handleAddLovePoints = (pts: number, reason?: string) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        lovePoints: (prev.lovePoints || 0) + pts,
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'ADD_LOVE_POINTS',
      payload: { points: pts, reason },
    });
  };

  // Quiz methods
  const handleQuizSubmitAnswer = (index: number, answer: string) => {
    const role = mqttRef.current?.getIsHost() ? 'host' : 'guest';
    setGameState((prev) => {
      const hostAnswers = { ...prev.understandingQuiz.hostAnswers };
      const guestAnswers = { ...prev.understandingQuiz.guestAnswers };
      if (role === 'host') hostAnswers[index] = answer;
      else guestAnswers[index] = answer;

      const next = {
        ...prev,
        understandingQuiz: { ...prev.understandingQuiz, hostAnswers, guestAnswers },
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'QUIZ_SUBMIT_ANSWER',
      payload: { role, questionIndex: index, answer },
    });
  };

  const handleQuizNextQuestion = (index: number) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        understandingQuiz: { ...prev.understandingQuiz, currentQuestionIndex: index },
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'QUIZ_NEXT_QUESTION',
      payload: index,
    });
  };

  const handleQuizRestart = () => {
    setGameState((prev) => {
      const next: CoupleGameState = {
        ...prev,
        understandingQuiz: {
          step: 'answering' as const,
          currentQuestionIndex: 0,
          hostAnswers: {},
          guestAnswers: {},
          matchCount: 0,
        },
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({ type: 'QUIZ_RESTART' });
  };

  // Quick QA methods
  const handleQASubmitAnswer = (answer: string) => {
    const role = mqttRef.current?.getIsHost() ? 'host' : 'guest';
    setGameState((prev) => {
      const hostAnswer = role === 'host' ? answer : prev.quickQA.hostAnswer;
      const guestAnswer = role === 'guest' ? answer : prev.quickQA.guestAnswer;
      const revealed = !!(hostAnswer && guestAnswer);

      const next = {
        ...prev,
        quickQA: { ...prev.quickQA, hostAnswer, guestAnswer, revealed },
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'QUICK_QA_ANSWER',
      payload: { role, answer },
    });
  };

  const handleQANextQuestion = (index: number) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        quickQA: {
          currentQuestionIndex: index,
          hostAnswer: null,
          guestAnswer: null,
          revealed: false,
        },
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'QUICK_QA_NEXT',
      payload: index,
    });
  };

  // Bucket list update
  const handleUpdateBucketList = (updated: BucketItem[]) => {
    setGameState((prev) => {
      const next = { ...prev, bucketList: updated };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'UPDATE_BUCKET_LIST',
      payload: updated,
    });
  };

  // Letters
  const handleSendLetter = (letter: LoveLetter) => {
    setGameState((prev) => {
      const next = { ...prev, letters: [letter, ...prev.letters] };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'ADD_LETTER',
      payload: letter,
    });
    handleAddLovePoints(30, 'Gửi thư tình');
  };

  const handleMarkLetterRead = (letterId: string) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        letters: prev.letters.map((l) => (l.id === letterId ? { ...l, read: true } : l)),
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'MARK_LETTER_READ',
      payload: { letterId },
    });
  };

  // Diaries
  const handleAddDiary = (entry: DiaryEntry) => {
    setGameState((prev) => {
      const next = { ...prev, diaries: [entry, ...prev.diaries] };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'ADD_DIARY',
      payload: entry,
    });
    handleAddLovePoints(25, 'Viết nhật ký kỷ niệm');
  };

  // Likes & Dislikes
  const handleUpdateLikesDislikes = (updated: LikesDislikes) => {
    setGameState((prev) => {
      const next = { ...prev, likesDislikes: updated };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'UPDATE_LIKES_DISLIKES',
      payload: updated,
    });
  };

  // RPS methods
  const handleRPSMove = (choice: 'rock' | 'paper' | 'scissors') => {
    const role = mqttRef.current?.getIsHost() ? 'host' : 'guest';
    setGameState((prev) => {
      const nextRps = {
        ...prev.rps,
        hostChoice: role === 'host' ? choice : prev.rps.hostChoice,
        guestChoice: role === 'guest' ? choice : prev.rps.guestChoice,
      };

      let hostWins = prev.rpsScore.hostWins;
      let guestWins = prev.rpsScore.guestWins;
      let draws = prev.rpsScore.draws;

      if (nextRps.hostChoice && nextRps.guestChoice) {
        if (nextRps.hostChoice === nextRps.guestChoice) {
          draws++;
          nextRps.winner = 'draw';
        } else if (
          (nextRps.hostChoice === 'rock' && nextRps.guestChoice === 'scissors') ||
          (nextRps.hostChoice === 'paper' && nextRps.guestChoice === 'rock') ||
          (nextRps.hostChoice === 'scissors' && nextRps.guestChoice === 'paper')
        ) {
          hostWins++;
          nextRps.winner = 'host';
        } else {
          guestWins++;
          nextRps.winner = 'guest';
        }
      }

      const next = {
        ...prev,
        rps: nextRps,
        rpsScore: { hostWins, guestWins, draws },
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'RPS_MOVE',
      payload: { role, choice },
    });
  };

  const handleRPSReset = (penalty?: string) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        rps: {
          hostChoice: null,
          guestChoice: null,
          roundNumber: prev.rps.roundNumber + 1,
          winner: null,
          penalty: penalty || null,
        },
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'RPS_RESET',
      payload: { penalty },
    });
  };

  // Wheel methods
  const handleSpinWheel = (state: WheelState) => {
    setGameState((prev) => {
      const next = { ...prev, wheelState: state };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'SPIN_WHEEL',
      payload: state,
    });
  };

  // Drawing canvas methods
  const handleSendStroke = (stroke: DrawStroke) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        drawingStrokes: [...prev.drawingStrokes, stroke],
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'DRAW_STROKE',
      payload: stroke,
    });
  };

  const handleClearCanvas = () => {
    setGameState((prev) => {
      const next = { ...prev, drawingStrokes: [] };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({ type: 'CLEAR_CANVAS' });
  };

  // Court methods
  const handleAddCourtCase = (newCase: CoupleCourtCase) => {
    setGameState((prev) => {
      const next = { ...prev, courtCases: [newCase, ...prev.courtCases] };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'COURT_ADD_CASE',
      payload: newCase,
    });
  };

  const handleVoteCourtCase = (
    caseId: string,
    verdict: 'guilty' | 'innocent',
    penalty: string
  ) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        courtCases: prev.courtCases.map((c) =>
          c.id === caseId ? { ...c, verdict, penalty } : c
        ),
      };
      saveGameState(next);
      return next;
    });

    mqttRef.current?.send({
      type: 'COURT_VOTE',
      payload: { caseId, verdict, penalty },
    });
  };

  // isInRoom is true ONLY when DataConnection is open and handshake completed!
  const isInRoom = connectionStatus === 'connected' || connectionStatus === 'reconnecting';

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50 flex flex-col font-sans relative overflow-x-hidden">
      {/* Floating ambient particles */}
      <FloatingHearts />

      {/* Header bar (when inside room) */}
      {isInRoom && (
        <Header
          connectionStatus={connectionStatus}
          roomCode={currentRoomCode || ''}
          lovePoints={gameState.lovePoints || 200}
          anniversaryDate={myProfile.anniversaryDate}
          onOpenFortune={() => setShowFortuneModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col z-10">
        {!isInRoom ? (
          <Lobby
            waitingCode={waitingCode}
            lastRoomCode={lastRoomCode}
            connectionStatus={connectionStatus}
            errorMessage={errorMessage}
            myProfile={myProfile}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onCancelWait={handleCancelWait}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        ) : activeView === 'main' ? (
          <MainDashboard
            myProfile={myProfile}
            partnerProfile={partnerProfile}
            connectionStatus={connectionStatus}
            lovePoints={gameState.lovePoints || 200}
            onOpenSweetMode={() => setActiveView('sweet')}
            onOpenBanterMode={() => setActiveView('banter')}
            onOpenNotebook={() => setActiveView('notebook')}
            onOpenSharedFeatures={() => setActiveView('shared')}
            onOpenFortune={() => setShowFortuneModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        ) : activeView === 'sweet' ? (
          <SweetModeHub
            gameState={gameState}
            myProfile={myProfile}
            partnerProfile={partnerProfile}
            onBack={() => setActiveView('main')}
            onQuizSubmitAnswer={handleQuizSubmitAnswer}
            onQuizNextQuestion={handleQuizNextQuestion}
            onQuizRestart={handleQuizRestart}
            onQASubmitAnswer={handleQASubmitAnswer}
            onQANextQuestion={handleQANextQuestion}
            onSendLetter={handleSendLetter}
            onMarkLetterRead={handleMarkLetterRead}
            onUpdateBucketList={handleUpdateBucketList}
          />
        ) : activeView === 'banter' ? (
          <BanterModeHub
            gameState={gameState}
            myProfile={myProfile}
            partnerProfile={partnerProfile}
            onBack={() => setActiveView('main')}
            onRPSMove={handleRPSMove}
            onRPSReset={handleRPSReset}
            onAddLovePoints={handleAddLovePoints}
            onAddCourtCase={handleAddCourtCase}
            onVoteCourtCase={handleVoteCourtCase}
          />
        ) : activeView === 'notebook' ? (
          <NotebookHub
            gameState={gameState}
            myProfile={myProfile}
            partnerProfile={partnerProfile}
            onBack={() => setActiveView('main')}
            onAddDiary={handleAddDiary}
            onUpdateLikesDislikes={handleUpdateLikesDislikes}
          />
        ) : activeView === 'shared' ? (
          <SharedHub
            gameState={gameState}
            myProfile={myProfile}
            partnerProfile={partnerProfile}
            onBack={() => setActiveView('main')}
            onSendStroke={handleSendStroke}
            onClearCanvas={handleClearCanvas}
            onSpinWheel={handleSpinWheel}
          />
        ) : null}
      </main>

      {/* Floating Chat Drawer (available inside room) */}
      {isInRoom && (
        <ChatDrawer
          isOpen={showChatDrawer}
          onToggle={() => {
            setShowChatDrawer(!showChatDrawer);
            if (!showChatDrawer) setUnreadChatCount(0);
          }}
          messages={gameState.chatMessages}
          unreadCount={unreadChatCount}
          myProfile={myProfile}
          partnerProfile={partnerProfile}
          onSendMessage={handleSendChatMessage}
        />
      )}

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={myProfile}
        onSave={handleSaveProfile}
      />

      <LoveFortune
        isOpen={showFortuneModal}
        onClose={() => setShowFortuneModal(false)}
        myProfile={myProfile}
        partnerProfile={partnerProfile}
      />
    </div>
  );
}
