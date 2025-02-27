"use client";

import React from "react";
import { GameModel } from "../models/GameModel";
import { GameController } from "../controllers/GameController";

type State = 
{
  board: number[];
  currentPlayer: "user" | "ai";
  gameOver: boolean;
  message: string;
};

export default class GameView extends React.Component<{}, State> 
{
  model: GameModel;
  controller: GameController;

  constructor(props: {}) 
  {
    super(props);
    this.model = new GameModel();
    this.controller = new GameController(this.model);
    this.state = 
    {
      board: this.model.board,
      currentPlayer: this.model.currentPlayer,
      gameOver: this.model.gameOver,
      message: this.model.message,
    };

    // Bind event handlers
    this.handleUserMove = this.handleUserMove.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentDidMount() 
  {
    // Subscribe to model updates
    this.model.addListener(() => {
      this.setState({
        board: [...this.model.board],
        currentPlayer: this.model.currentPlayer,
        gameOver: this.model.gameOver,
        message: this.model.message,
      });
    });
  }

  handleUserMove(pitIndex: number) 
  {
    this.controller.handleUserMove(pitIndex);
  }

  resetGame(playerFirst: "user" | "ai") 
  {
    this.controller.resetGame(playerFirst);
  }
  
  // Render the game board and controls
  render() 
  {
    const { board, currentPlayer, gameOver, message } = this.state;
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Mancala</h1>
            <div className="space-x-4 mb-4">
              <button
                onClick={() => this.resetGame("ai")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                AI First
              </button>
              <button
                onClick={() => this.resetGame("user")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                User First
              </button>
            </div>
            <p className="text-xl text-gray-600">
              {message ||
                (currentPlayer === "user" ? "Your Turn" : "AI Thinking...")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* AI Mancala */}
            <div className="w-16 h-32 md:w-20 md:h-40 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl">
              {board[13]}
            </div>

            <div className="flex flex-col gap-4">
              {/* AI Pits */}
              <div className="flex gap-2 md:gap-4">
                {[12, 11, 10, 9, 8, 7].map((pitIndex) => (
                  <button
                    key={pitIndex}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white 
                      ${board[pitIndex] ? "bg-yellow-500" : "bg-gray-300"
                      } cursor-default`}
                  >
                    {board[pitIndex]}
                  </button>
                ))}
              </div>

              {/* User Pits */}
              <div className="flex gap-2 md:gap-4">
                {[0, 1, 2, 3, 4, 5].map((pitIndex) => (
                  <button
                    key={pitIndex}
                    onClick={() => this.handleUserMove(pitIndex)}
                    disabled={
                      currentPlayer !== "user" || gameOver || !board[pitIndex]
                    }
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white
                      ${currentPlayer === "user" && board[pitIndex]
                        ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                      }`}
                  >
                    {board[pitIndex]}
                  </button>
                ))}
              </div>
            </div>

            {/* User Mancala */}
            <div className="w-16 h-32 md:w-20 md:h-40 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
              {board[6]}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
