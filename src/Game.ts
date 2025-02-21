import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private moves: string[];
  private startTime: number;
  private moveCount: number;
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = Date.now();
    this.moveCount = 0;
    console.log("Game started");
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: "white",
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: "black",
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    // validation here
    console.log("MOVE3");
    if (this.moveCount % 2 == 0 && socket !== this.player1) {
      return;
    }

    if (this.moveCount % 2 == 1 && socket !== this.player2) {
      return;
    }
    try {
      this.board.move(move);

      console.log("MOVE4");
    } catch (error) {
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    if (this.moveCount % 2 == 0) {
      console.log("MOVE5");
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      console.log("MOVE6");
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
    this.moveCount++;
  }
}
