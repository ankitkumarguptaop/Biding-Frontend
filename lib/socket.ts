import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  const parsed = JSON.parse(localStorage.getItem("persist:root") || "{}");
  const userState = parsed?.user ? JSON.parse(parsed.user) : null;
  const token = userState?.token;

  if (!socket) {
    socket = io("http://localhost:8080", {
      transports: ["websocket"],
      autoConnect: true,
      auth: {
        token: token, 
      },
    });
  }
  return socket;
};
