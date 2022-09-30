const { Server } = require("ws");
const server = new Server({ port: 5001 });

/** @type {Map<string, { pid: string, username: string, socket: WebSocket }>} */
const waitlist = new Map();
const games = [];

server.on("connection", (socket) => {
  socket.on("open", (e) => {
    console.log("Connected");
  });
  socket.on("message", (raw) => {
    const message = raw.toString();
    console.log(raw.toString());
    const data = JSON.parse(message);
    if (data.type === "join") {
      console.log("Joined");
      waitlist.set(data.pid, { pid: data.pid, username: data.username, socket });
      if (waitlist.size >= 2) {
        const gameRoomId = Math.random().toString(36).slice(2);
        const [p1, p2] = [...waitlist.values()];
        p1.socket.send(JSON.stringify({ type: "ready", gameRoomId }));
        p2.socket.send(JSON.stringify({ type: "ready", gameRoomId }));
        waitlist.delete(p1.pid);
        waitlist.delete(p2.pid);
        games.push({ gameRoomId, p1, p2 });
      }
    } else if (data.type === "stop") {
      const game = games.find(x => x.gameRoomId === data.gameRoomId);
      const playerNum = game.p1.pid === data.pid ? 1 : 2;
      game[`p${playerNum}`].point = data.point;
      if (game[`p${playerNum === 1 ? 2:1}`].point !== undefined) {
        game[`p${playerNum === 1 ? 2:1}`].socket.send(JSON.stringify({ type: "enemyPoint", point: game[`p${playerNum}`].point, username: game[`p${playerNum}`].username }));
        game[`p${playerNum}`].socket.send(JSON.stringify({ type: "enemyPoint", point: game[`p${playerNum === 1 ? 2:1}`].point, username: game[`p${playerNum === 1 ? 2:1}`].username }));
      }
    }
    
  });
  socket.on("close", () => {
    console.log("Connection closed");
  });
});

console.log("Running");