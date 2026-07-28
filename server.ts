import express from "express";
import http from "http";
import path from "path";
import { Server as SocketIOServer, Socket } from "socket.io";
import { createServer as createViteServer } from "vite";
import {
  StatementChoice,
  GameStatus,
  Player,
  RoundData,
  PublicGameRoom,
  ScoreGain,
  RoundResultPayload,
  StatementSubmission
} from "./src/types";

const TEACHER_PASSWORD = "180702";
const PORT = 3000;

interface InternalRoom {
  pin: string;
  hostSocketId: string;
  status: GameStatus;
  players: Map<string, Player>; // socketId/studentId -> Player
  completedPresenterIds: string[];
  currentRound: RoundData | null;
  createdAt: number;
}

const rooms = new Map<string, InternalRoom>();

function generatePin(): string {
  let pin: string;
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(pin));
  return pin;
}

function sanitizeRoomForClient(room: InternalRoom, requestingSocketId?: string): PublicGameRoom {
  const playersList: Omit<Player, "submission">[] = Array.from(room.players.values()).map((p) => {
    const { submission, ...rest } = p;
    return rest;
  });

  // Sanitized round data: hide lieIndex if round is in 'voting' phase
  let currentRoundSanitized: RoundData | null = null;
  if (room.currentRound) {
    const isHost = room.hostSocketId === requestingSocketId;
    const isRevealed = room.currentRound.status === "revealed";

    currentRoundSanitized = {
      ...room.currentRound,
      lieIndex: isRevealed || isHost ? room.currentRound.lieIndex : null,
    };
  }

  return {
    pin: room.pin,
    status: room.status,
    players: playersList,
    currentRound: currentRoundSanitized,
    completedPresenterIds: room.completedPresenterIds,
    totalPresenters: Array.from(room.players.values()).filter((p) => p.submitted).length,
    createdAt: room.createdAt,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // REST API endpoint for Teacher authentication check
  app.post("/api/teacher/auth", (req, res) => {
    const { password } = req.body;
    if (password === TEACHER_PASSWORD) {
      res.json({ success: true, token: "teacher_valid_180702" });
    } else {
      res.status(401).json({ success: false, error: "Incorrect teacher password!" });
    }
  });

  // Helper API to inspect room state
  app.get("/api/room/:pin", (req, res) => {
    const room = rooms.get(req.params.pin);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(sanitizeRoomForClient(room));
  });

  // Socket.IO real-time event handling
  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // --- TEACHER EVENTS ---
    socket.on("teacher:create_room", (data: { password?: string }, callback) => {
      if (data?.password !== TEACHER_PASSWORD) {
        return callback?.({ success: false, error: "Invalid password" });
      }

      const pin = generatePin();
      const newRoom: InternalRoom = {
        pin,
        hostSocketId: socket.id,
        status: "lobby",
        players: new Map(),
        completedPresenterIds: [],
        currentRound: null,
        createdAt: Date.now(),
      };

      rooms.set(pin, newRoom);
      socket.join(pin);
      socket.join(`host_${pin}`);

      callback?.({ success: true, pin, room: sanitizeRoomForClient(newRoom, socket.id) });
      console.log(`[Room Created] PIN: ${pin} by Host: ${socket.id}`);
    });

    socket.on("teacher:start_submission_phase", (data: { pin: string }) => {
      const room = rooms.get(data.pin);
      if (!room || room.hostSocketId !== socket.id) return;

      room.status = "submitting";
      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
    });

    socket.on("teacher:select_presenter", (data: { pin: string; studentId: string }, callback) => {
      const room = rooms.get(data.pin);
      if (!room || room.hostSocketId !== socket.id) return;

      const presenter = room.players.get(data.studentId);
      if (!presenter || !presenter.submission) {
        return callback?.({ success: false, error: "Student submission not found" });
      }

      room.status = "playing";
      room.currentRound = {
        roundIndex: room.completedPresenterIds.length + 1,
        presenterStudentId: presenter.id,
        presenterName: presenter.name,
        statements: {
          A: presenter.submission.statementA,
          B: presenter.submission.statementB,
          C: presenter.submission.statementC,
        },
        lieIndex: presenter.submission.lieIndex,
        votes: {},
        status: "voting",
        startTime: Date.now(),
      };

      // Reset voting status on players
      room.players.forEach((p) => {
        p.hasVotedCurrentRound = false;
      });

      // Broadcast room update
      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
      io.to(data.pin).emit("round:started", {
        presenterName: presenter.name,
        presenterId: presenter.id,
        statements: room.currentRound.statements,
      });

      callback?.({ success: true });
    });

    socket.on("teacher:reveal_answer", (data: { pin: string }, callback) => {
      const room = rooms.get(data.pin);
      if (!room || room.hostSocketId !== socket.id || !room.currentRound) return;

      if (room.currentRound.status === "revealed") {
        return callback?.({ success: false, error: "Already revealed" });
      }

      const currentRound = room.currentRound;
      currentRound.status = "revealed";
      currentRound.revealTime = Date.now();

      const actualLie = currentRound.lieIndex;
      const scoreGains: Record<string, ScoreGain> = {};
      let totalVoters = 0;
      let fooledCount = 0;

      // Calculate votes & scores for voters
      Object.entries(currentRound.votes).forEach(([voterId, choice]) => {
        totalVoters++;
        const voter = room.players.get(voterId);
        const isCorrect = choice === actualLie;

        if (!isCorrect) {
          fooledCount++;
        }

        if (voter) {
          let pointsGained = 0;
          let newStreak = isCorrect ? (voter.streak || 0) + 1 : 0;

          if (isCorrect) {
            // Speed bonus calculation (max 1000, min 500)
            const timeTaken = (currentRound.revealTime! - currentRound.startTime) / 1000;
            const speedBonus = Math.max(0, Math.floor(500 - timeTaken * 15));
            pointsGained = 500 + speedBonus + (newStreak > 1 ? newStreak * 50 : 0);
          }

          voter.score += pointsGained;
          voter.streak = newStreak;

          scoreGains[voterId] = {
            studentId: voterId,
            pointsGained,
            isCorrect,
            newScore: voter.score,
            newStreak,
          };
        }
      });

      // Deception Bonus for presenter (e.g., 200 pts per fooled classmate!)
      const presenter = room.players.get(currentRound.presenterStudentId);
      let deceptionPointsEarned = 0;
      if (presenter && totalVoters > 0) {
        deceptionPointsEarned = fooledCount * 250;
        presenter.score += deceptionPointsEarned;
      }

      currentRound.deceptionPointsEarned = deceptionPointsEarned;
      currentRound.fooledCount = fooledCount;
      currentRound.totalVoters = totalVoters;

      if (!room.completedPresenterIds.includes(currentRound.presenterStudentId)) {
        room.completedPresenterIds.push(currentRound.presenterStudentId);
      }

      // Leaderboard
      const leaderboard = Array.from(room.players.values())
        .map((p) => ({ id: p.id, name: p.name, score: p.score, rank: 1 }))
        .sort((a, b) => b.score - a.score)
        .map((p, idx) => ({ ...p, rank: idx + 1 }));

      const resultPayload: RoundResultPayload = {
        round: currentRound,
        scoreGains,
        deceptionBonus: presenter ? {
          studentId: presenter.id,
          studentName: presenter.name,
          points: deceptionPointsEarned,
          fooledCount
        } : null,
        leaderboard,
      };

      // Broadcast reveal event & room state
      io.to(data.pin).emit("round:revealed", resultPayload);
      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));

      callback?.({ success: true, resultPayload });
    });

    socket.on("teacher:next_round", (data: { pin: string }) => {
      const room = rooms.get(data.pin);
      if (!room || room.hostSocketId !== socket.id) return;

      room.currentRound = null;
      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
    });

    socket.on("teacher:end_game", (data: { pin: string }) => {
      const room = rooms.get(data.pin);
      if (!room || room.hostSocketId !== socket.id) return;

      room.status = "ended";
      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
    });

    socket.on("teacher:seed_demo_data", (data: { pin: string }) => {
      const room = rooms.get(data.pin);
      if (!room || room.hostSocketId !== socket.id) return;

      const demoStudents = [
        {
          name: "Emma W.",
          statementA: "I have eaten fried grasshoppers in Thailand.",
          statementB: "I can solve a Rubik's cube under 30 seconds.",
          statementC: "I have broken my left arm three separate times.",
          lieIndex: "C" as StatementChoice,
        },
        {
          name: "Liam K.",
          statementA: "I met an astronaut in an elevator.",
          statementB: "I have a twin brother who lives in Tokyo.",
          statementC: "I can speak fluent French and Spanish.",
          lieIndex: "B" as StatementChoice,
        },
        {
          name: "Sophia R.",
          statementA: "I own two pet hedgehogs named Peanut & Butter.",
          statementB: "I won a state-wide math competition in 6th grade.",
          statementC: "I have met Taylor Swift at a coffee shop.",
          lieIndex: "C" as StatementChoice,
        },
        {
          name: "Noah T.",
          statementA: "I built my own gaming PC from scratch.",
          statementB: "I have been scuba diving with reef sharks.",
          statementC: "I can play 4 different musical instruments.",
          lieIndex: "A" as StatementChoice,
        },
      ];

      demoStudents.forEach((demo, idx) => {
        const id = `demo_student_${Date.now()}_${idx}`;
        const player: Player = {
          id,
          name: demo.name,
          score: Math.floor(Math.random() * 800),
          submitted: true,
          streak: Math.floor(Math.random() * 3),
          submission: {
            statementA: demo.statementA,
            statementB: demo.statementB,
            statementC: demo.statementC,
            lieIndex: demo.lieIndex,
            submittedAt: Date.now(),
          },
        };
        room.players.set(id, player);
      });

      if (room.status === "lobby") {
        room.status = "submitting";
      }

      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
    });

    // --- STUDENT EVENTS ---
    socket.on("student:join_room", (data: { pin: string; name: string; studentId?: string }, callback) => {
      const room = rooms.get(data.pin);
      if (!room) {
        return callback?.({ success: false, error: "Game session / PIN not found!" });
      }

      const cleanName = data.name.trim();
      if (!cleanName) {
        return callback?.({ success: false, error: "Please enter your name" });
      }

      const playerId = socket.id;

      let existingPlayer: Player | undefined;
      // Check if reconnecting by existing ID or same name
      for (const p of room.players.values()) {
        if (p.name.toLowerCase() === cleanName.toLowerCase()) {
          existingPlayer = p;
          break;
        }
      }

      if (existingPlayer) {
        // Transfer socket
        room.players.delete(existingPlayer.id);
        existingPlayer.id = playerId;
        room.players.set(playerId, existingPlayer);
      } else {
        const newPlayer: Player = {
          id: playerId,
          name: cleanName,
          score: 0,
          submitted: false,
          streak: 0,
        };
        room.players.set(playerId, newPlayer);
      }

      socket.join(data.pin);

      callback?.({
        success: true,
        studentId: playerId,
        player: room.players.get(playerId),
        room: sanitizeRoomForClient(room, socket.id),
      });

      // Broadcast update to all
      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
      console.log(`[Student Joined] ${cleanName} (${playerId}) joined room ${data.pin}`);
    });

    socket.on(
      "student:submit_statements",
      (
        data: {
          pin: string;
          statementA: string;
          statementB: string;
          statementC: string;
          lieIndex: StatementChoice;
        },
        callback
      ) => {
        const room = rooms.get(data.pin);
        if (!room) return callback?.({ success: false, error: "Room not found" });

        const player = room.players.get(socket.id);
        if (!player) return callback?.({ success: false, error: "Player not found in room" });

        if (!data.statementA.trim() || !data.statementB.trim() || !data.statementC.trim()) {
          return callback?.({ success: false, error: "Please fill in all 3 statements!" });
        }

        if (!["A", "B", "C"].includes(data.lieIndex)) {
          return callback?.({ success: false, error: "Please pick which statement is your lie!" });
        }

        player.submitted = true;
        player.submission = {
          statementA: data.statementA.trim(),
          statementB: data.statementB.trim(),
          statementC: data.statementC.trim(),
          lieIndex: data.lieIndex,
          submittedAt: Date.now(),
        };

        callback?.({ success: true });
        io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
        console.log(`[Submission] Player ${player.name} submitted statements for room ${data.pin}`);
      }
    );

    socket.on("student:cast_vote", (data: { pin: string; choice: StatementChoice }, callback) => {
      const room = rooms.get(data.pin);
      if (!room || !room.currentRound || room.currentRound.status !== "voting") {
        return callback?.({ success: false, error: "No active voting round!" });
      }

      const player = room.players.get(socket.id);
      if (!player) return callback?.({ success: false, error: "Player not registered" });

      // Safeguard 1: Cannot vote on your own statements
      if (room.currentRound.presenterStudentId === socket.id) {
        return callback?.({ success: false, error: "You cannot vote on your own statements!" });
      }

      // Safeguard 2: Cannot vote twice in same round
      if (room.currentRound.votes[socket.id]) {
        return callback?.({ success: false, error: "You have already voted in this round!" });
      }

      if (!["A", "B", "C"].includes(data.choice)) {
        return callback?.({ success: false, error: "Invalid choice" });
      }

      room.currentRound.votes[socket.id] = data.choice;
      player.hasVotedCurrentRound = true;

      callback?.({ success: true, choice: data.choice });

      // Calculate total votes
      const voteCounts = { A: 0, B: 0, C: 0, total: 0 };
      Object.values(room.currentRound.votes).forEach((v) => {
        voteCounts[v]++;
        voteCounts.total++;
      });

      // Emit live vote update to host and room
      io.to(data.pin).emit("vote:counted", {
        votes: voteCounts,
        voterId: socket.id,
        voterName: player.name,
      });

      io.to(data.pin).emit("room:updated", sanitizeRoomForClient(room));
    });

    socket.on("disconnect", () => {
      console.log(`[Socket Disconnected] ${socket.id}`);
      // Find room where socket is player or host
      rooms.forEach((room, pin) => {
        if (room.players.has(socket.id)) {
          // Keep player record so they can rejoin without losing score
          io.to(pin).emit("room:updated", sanitizeRoomForClient(room));
        }
      });
    });
  });

  // Setup Vite development server or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server Startup Error]", err);
});
