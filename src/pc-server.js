import { WebSocketServer } from "ws";
import robot from "robotjs";

const wss = new WebSocketServer({ port: 3000 });

console.log("Servidor WebSocket rodando em ws://192.168.18.4:3000");

const MOUSE_SENSITIVITY = 1.5;

wss.on("connection", (ws, request) => {
  console.log("Nova conexão WebSocket.");

  ws.on("message", (data) => {
    console.log("Data: ", data.toString());

    let message;

    try {
      message = JSON.parse(data.toString());
    } catch (err) {
      console.log("Mensagem inválida: ", data.toString());
      return;
    }

    // Controle de slides
    if (message.type === "COMMAND") {
      if (message.command === "RIGHT") {
        robot.keyTap("right");
      }

      if (message.command === "LEFT") {
        robot.keyTap("left");
      }
    }

    // Controle do mouse
    if (message.type === "POINTER_MOVE") {
      const mouse = robot.getMousePos();

      const dx = message.dx + MOUSE_SENSITIVITY;
      const dy = message.dy + MOUSE_SENSITIVITY;

      robot.moveMouse(mouse.x + dx, mouse.y + dy);
    }
  });

  ws.on("close", (code) => {
    console.log(`Conexão WebSocket fechada. Código: ${code}`);
  });

  ws.on("error", (err) => {
    console.log("Erro no socket: %o", err);
  });
});
