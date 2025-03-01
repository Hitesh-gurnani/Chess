"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = Date.now();
        this.moveCount = 0;
        console.log("Game started");
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: "white",
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: "black",
        }));
    }
    makeMove(socket, move) {
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
        }
        catch (error) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        if (this.moveCount % 2 == 0) {
            console.log("MOVE5");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            console.log("MOVE6");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
