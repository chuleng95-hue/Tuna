import { io, Socket } from 'socket.io-client';

// Use current origin so it connects to the same server handling the page
const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('[Socket Service] Connected to server:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket Service] Disconnected:', reason);
});
