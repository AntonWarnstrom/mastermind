import io from "socket.io-client";

export const socket = io("http://localhost:8081");
// socket.connected will return true if there's a successful connection to the socket server-
socket.on("connect", () => {
  console.log(socket.connected); 
});