import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TeacherPasswordModal } from './components/TeacherPasswordModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { TeacherLobby } from './components/TeacherView/TeacherLobby';
import { TeacherPresenterPicker } from './components/TeacherView/TeacherPresenterPicker';
import { TeacherVotingDashboard } from './components/TeacherView/TeacherVotingDashboard';
import { TeacherRevealView } from './components/TeacherView/TeacherRevealView';
import { TeacherFinalLeaderboard } from './components/TeacherView/TeacherFinalLeaderboard';
import { StudentJoin } from './components/StudentView/StudentJoin';
import { StudentStatementForm } from './components/StudentView/StudentStatementForm';
import { StudentWaitingRoom } from './components/StudentView/StudentWaitingRoom';
import { StudentVotingScreen } from './components/StudentView/StudentVotingScreen';
import { StudentResultScreen } from './components/StudentView/StudentResultScreen';

import { socket } from './services/socket';
import { PublicGameRoom, RoundResultPayload, StatementChoice } from './types';
import { soundEffects } from './utils/audio';

import { ShieldCheck, Users, Gamepad2, Sparkles, ArrowRight, BookOpen, Smartphone, Laptop } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<'chooser' | 'teacher' | 'student'>('chooser');
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // Room & Player State
  const [room, setRoom] = useState<PublicGameRoom | null>(null);
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [hasSubmittedStatements, setHasSubmittedStatements] = useState(false);

  // Student voting state
  const [hasVotedCurrentRound, setHasVotedCurrentRound] = useState(false);
  const [myVote, setMyVote] = useState<StatementChoice | undefined>(undefined);

  // Round Result State
  const [latestResult, setLatestResult] = useState<RoundResultPayload | null>(null);

  // UI Error & Loading States
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check URL query string for initial game PIN
  const [urlPin, setUrlPin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pinParam = params.get('pin');
      if (pinParam) {
        setUrlPin(pinParam);
        setRole('student');
      }
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    socket.on('room:updated', (updatedRoom: PublicGameRoom) => {
      setRoom(updatedRoom);
      setIsLoading(false);

      // Check student voting status if current round changed
      if (updatedRoom.currentRound) {
        if (updatedRoom.currentRound.status === 'voting') {
          // If a new round started, reset vote state if needed
          const myVoteRecorded = updatedRoom.currentRound.votes[studentId || socket.id];
          if (myVoteRecorded) {
            setHasVotedCurrentRound(true);
            setMyVote(myVoteRecorded);
          } else {
            setHasVotedCurrentRound(false);
            setMyVote(undefined);
          }
        }
      } else {
        setHasVotedCurrentRound(false);
        setMyVote(undefined);
        setLatestResult(null);
      }
    });

    socket.on('round:revealed', (payload: RoundResultPayload) => {
      setLatestResult(payload);
    });

    return () => {
      socket.off('room:updated');
      socket.off('round:revealed');
    };
  }, [studentId]);

  // --- TEACHER ACTIONS ---
  const handleTeacherAccessAttempt = () => {
    soundEffects.playClick();
    const token = sessionStorage.getItem('teacher_auth_token');
    if (token === 'teacher_valid_180702') {
      createTeacherRoom();
    } else {
      setIsTeacherModalOpen(true);
    }
  };

  const handleTeacherPasswordSuccess = () => {
    setIsTeacherModalOpen(false);
    createTeacherRoom();
  };

  const createTeacherRoom = () => {
    setIsLoading(true);
    setErrorMsg('');
    socket.emit('teacher:create_room', { password: '180702' }, (response: any) => {
      setIsLoading(false);
      if (response?.success) {
        setRoom(response.room);
        setRole('teacher');
      } else {
        setErrorMsg(response?.error || 'Failed to create game room!');
      }
    });
  };

  const handleStartSubmissionPhase = () => {
    if (!room) return;
    socket.emit('teacher:start_submission_phase', { pin: room.pin });
  };

  const handleSelectPresenter = (presenterStudentId: string) => {
    if (!room) return;
    setLatestResult(null);
    socket.emit('teacher:select_presenter', { pin: room.pin, studentId: presenterStudentId });
  };

  const handleRevealAnswer = () => {
    if (!room) return;
    socket.emit('teacher:reveal_answer', { pin: room.pin });
  };

  const handleNextRound = () => {
    if (!room) return;
    setLatestResult(null);
    socket.emit('teacher:next_round', { pin: room.pin });
  };

  const handleEndGame = () => {
    if (!room) return;
    socket.emit('teacher:end_game', { pin: room.pin });
  };

  const handleSeedDemoData = () => {
    if (!room) return;
    socket.emit('teacher:seed_demo_data', { pin: room.pin });
  };

  // --- STUDENT ACTIONS ---
  const handleStudentJoin = (pin: string, name: string) => {
    setIsLoading(true);
    setErrorMsg('');
    socket.emit('student:join_room', { pin, name }, (response: any) => {
      setIsLoading(false);
      if (response?.success) {
        setStudentId(response.studentId || socket.id);
        setStudentName(name);
        setRoom(response.room);
        setRole('student');

        // Check if player already submitted
        const me = response.room.players.find((p: any) => p.name === name);
        if (me && me.submitted) {
          setHasSubmittedStatements(true);
        }
      } else {
        setErrorMsg(response?.error || 'Could not join room. Check Game PIN!');
      }
    });
  };

  const handleStudentSubmitStatements = (
    statementA: string,
    statementB: string,
    statementC: string,
    lieIndex: StatementChoice
  ) => {
    if (!room) return;
    setIsLoading(true);
    setErrorMsg('');
    socket.emit(
      'student:submit_statements',
      { pin: room.pin, statementA, statementB, statementC, lieIndex },
      (response: any) => {
        setIsLoading(false);
        if (response?.success) {
          soundEffects.playCorrect();
          setHasSubmittedStatements(true);
        } else {
          setErrorMsg(response?.error || 'Failed to submit statements');
        }
      }
    );
  };

  const handleStudentCastVote = (choice: StatementChoice) => {
    if (!room || !room.currentRound) return;
    setIsLoading(true);
    setErrorMsg('');
    socket.emit('student:cast_vote', { pin: room.pin, choice }, (response: any) => {
      setIsLoading(false);
      if (response?.success) {
        setHasVotedCurrentRound(true);
        setMyVote(choice);
      } else {
        setErrorMsg(response?.error || 'Could not register vote');
      }
    });
  };

  const handleExit = () => {
    setRole('chooser');
    setRoom(null);
    setHasSubmittedStatements(false);
    setHasVotedCurrentRound(false);
    setLatestResult(null);
  };

  const myPlayer = room?.players.find((p) => p.id === studentId || p.name === studentName);

  return (
    <div className="min-h-screen bg-[#FFF9F0] font-sans text-[#2D3436] flex flex-col selection:bg-[#FFD93D] selection:text-[#2D3436]">
      {/* Navigation Header */}
      <Navbar
        role={role}
        pin={room?.pin}
        studentName={studentName}
        score={myPlayer?.score || 0}
        onOpenDeployGuide={() => setIsDeployModalOpen(true)}
        onExit={handleExit}
      />

      {/* Main Body Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* VIEW 1: ROLE CHOOSER */}
        {role === 'chooser' && (
          <div className="max-w-3xl mx-auto my-auto w-full space-y-8 animate-in fade-in duration-300">
            {/* Hero Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] rounded-full text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#2D3436]">
                <Sparkles className="w-4 h-4 text-[#E17055]" /> Real-Time Icebreaker Game
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[#2D3436] tracking-tight">
                TRUTH <span className="text-[#00B894]">&</span> LIE 🤥
              </h1>
              <p className="text-base md:text-lg font-bold text-[#636E72] max-w-lg mx-auto">
                The interactive classroom game where students submit secret statements and vote live on device screens!
              </p>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Role Card */}
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setRole('student');
                }}
                className="group cursor-pointer bg-white hover:bg-[#81ECEC]/20 rounded-[32px] p-6 md:p-8 border-4 border-[#00CEC9] shadow-[8px_8px_0px_0px_#00CEC9] transition-all duration-200 flex flex-col justify-between space-y-6 transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[#81ECEC] text-[#2D3436] border-2 border-[#00CEC9] rounded-2xl flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform shadow-[3px_3px_0px_0px_#00CEC9]">
                    <Smartphone className="w-8 h-8 text-[#00B894]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#2D3436]">
                      Join as Student
                    </h2>
                    <p className="text-xs font-bold text-[#636E72] mt-1 leading-relaxed">
                      Enter the Game PIN, submit your 3 statements, and guess your classmates' lies in real time!
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#81ECEC] flex items-center justify-between text-[#00B894] font-black text-sm">
                  <span>Join Game Session</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Teacher / Host Role Card */}
              <div
                onClick={handleTeacherAccessAttempt}
                className="group cursor-pointer bg-white hover:bg-[#FAB1A0]/20 text-[#2D3436] rounded-[32px] p-6 md:p-8 border-4 border-[#E17055] shadow-[8px_8px_0px_0px_#E17055] transition-all duration-200 flex flex-col justify-between space-y-6 transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[#FAB1A0] text-[#2D3436] border-2 border-[#E17055] rounded-2xl flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform shadow-[3px_3px_0px_0px_#E17055]">
                    <Laptop className="w-8 h-8 text-[#D63031]" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#D63031] bg-[#FAB1A0]/50 border border-[#E17055] px-2.5 py-0.5 rounded-full mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Password Protected
                    </div>
                    <h2 className="text-2xl font-black text-[#2D3436]">
                      Host as Teacher
                    </h2>
                    <p className="text-xs text-[#636E72] mt-1 leading-relaxed">
                      Create a room, project the live statements screen, manage rounds, and reveal answers with confetti!
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#FAB1A0] flex items-center justify-between text-[#E17055] font-black text-sm">
                  <span>Teacher Control Center</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TEACHER / HOST FLOW */}
        {role === 'teacher' && room && (
          <div className="w-full">
            {room.status === 'lobby' || room.status === 'submitting' ? (
              <TeacherLobby
                room={room}
                onSeedDemoData={handleSeedDemoData}
                onStartSubmissionPhase={handleStartSubmissionPhase}
                onSelectPresenter={handleSelectPresenter}
              />
            ) : room.status === 'playing' ? (
              latestResult ? (
                <TeacherRevealView
                  result={latestResult}
                  onNextRound={() => {
                    handleNextRound();
                  }}
                  onEndGame={handleEndGame}
                />
              ) : room.currentRound ? (
                <TeacherVotingDashboard
                  round={room.currentRound}
                  totalEligibleVoters={Math.max(0, room.players.length - 1)}
                  onRevealAnswer={handleRevealAnswer}
                />
              ) : (
                <TeacherPresenterPicker
                  room={room}
                  onSelectPresenter={handleSelectPresenter}
                />
              )
            ) : room.status === 'ended' ? (
              <TeacherFinalLeaderboard
                room={room}
                onRestartNewGame={handleTeacherAccessAttempt}
              />
            ) : null}
          </div>
        )}

        {/* VIEW 3: STUDENT FLOW */}
        {role === 'student' && (
          <div className="w-full my-auto">
            {!room ? (
              <StudentJoin
                initialPin={urlPin}
                onJoin={handleStudentJoin}
                isLoading={isLoading}
                error={errorMsg}
              />
            ) : !hasSubmittedStatements ? (
              <StudentStatementForm
                studentName={studentName}
                onSubmit={handleStudentSubmitStatements}
                isSubmitting={isLoading}
                error={errorMsg}
              />
            ) : latestResult ? (
              <StudentResultScreen result={latestResult} studentId={studentId} />
            ) : room.currentRound && room.currentRound.status === 'voting' ? (
              <StudentVotingScreen
                round={room.currentRound}
                studentId={studentId}
                hasVoted={hasVotedCurrentRound}
                myVote={myVote}
                onCastVote={handleStudentCastVote}
                isVoting={isLoading}
                error={errorMsg}
              />
            ) : (
              <StudentWaitingRoom studentName={studentName} pin={room.pin} />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <TeacherPasswordModal
        isOpen={isTeacherModalOpen}
        onSuccess={handleTeacherPasswordSuccess}
        onCancel={() => setIsTeacherModalOpen(false)}
      />

      <DeployGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        pin={room?.pin}
      />
    </div>
  );
}
