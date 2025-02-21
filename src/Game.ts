import { Chess } from "chess.js";
import { WebSocket } from "ws";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private moves: string[];
  private startTime: number;
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = Date.now();
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    // validation here

    if (this.board.moves.length % 2 == 0 && socket === this.player1) {
      return;
    }

    if (this.board.moves.length % 2 == 1 && socket === this.player2) {
      return;
    }
    try {
      this.board.move(move);
    } catch (error) {
      return;
    }

    // is this users move
    // update the board
    // check for win
    // send the board to the users
  }
}
