'use client';

import React from "react";
import { GameModel } from "@/models/GameModel";
import { GameController } from "@/controllers/GameController";
import { ThemeProviderContext } from "@/components/ui/theme-provider";

type GameViewProps = {}; // No props needed

type State = {
  board: number[];
  currentPlayer: "user" | "ai";
  gameOver: boolean;
  started: "user" | "ai";
  message: string;
  soundEnabled: boolean;
  highContrast: boolean;
  gameStarted: boolean;
};

class GameView extends React.Component<GameViewProps, State> {
  static contextType = ThemeProviderContext;
  context!: React.ContextType<typeof ThemeProviderContext>;

  model: GameModel;
  controller: GameController;
  moveSound: any;
  winSound: any;
  loseSound: any;

  constructor(props: GameViewProps) {
    super(props);
    this.model = new GameModel();
    this.controller = new GameController(this.model);
    this.state = {
      board: this.model.board,
      currentPlayer: this.model.currentPlayer,
      gameOver: this.model.gameOver,
      message: this.model.message,
      started: this.model.started,
      soundEnabled: true,
      highContrast: true,
      gameStarted: false,
    };

    this.handleUserMove = this.handleUserMove.bind(this);
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
    this.toggleContrast = this.toggleContrast.bind(this);
    this.handleMediaQueryChange = this.handleMediaQueryChange.bind(this);

    if (typeof window !== "undefined") {
      this.moveSound = new Audio("/sounds/move.wav");
      this.winSound = new Audio("/sounds/win.wav");
      this.loseSound = new Audio("/sounds/win.wav");
    }
  }

  componentDidMount() {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.handleKeyDown);
    if (this.context.theme === "system" && typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", this.handleMediaQueryChange);
    }
    this.model.addListener(() => {
      const newState = {
        board: [...this.model.board],
        currentPlayer: this.model.currentPlayer,
        gameOver: this.model.gameOver,
        message: this.model.message,
        started: this.model.started,
        soundEnabled: this.state.soundEnabled,
        highContrast: this.state.highContrast,
        gameStarted: this.state.gameStarted,
      };
      this.setState(newState);
      if (this.state.soundEnabled) {
        if (this.model.gameOver) {
          if (this.model.message === "You Win!") {
            this.winSound.play().catch((e: Error) => console.warn("Sound failed:", e));
            if (navigator.vibrate) {
              navigator.vibrate([100, 50, 100, 50, 100]);
            }
          } else if (this.model.message === "AI Wins!") {
            this.loseSound.play().catch((e: Error) => console.warn("Sound failed:", e));
            if (navigator.vibrate) {
              navigator.vibrate(500);
            }
          }
        } else {
          this.moveSound.play().catch((e: Error) => console.warn("Sound failed:", e));
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }
    });
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
    document.removeEventListener("keydown", this.handleKeyDown);
    if (this.context.theme === "system" && typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.removeEventListener("change", this.handleMediaQueryChange);
    }
  }

  handleMediaQueryChange() {
    this.forceUpdate();
  }

  // Using context to compute the theme.
  getComputedTheme() {
    const { theme, computedTheme } = this.context;
    return theme === "system" ? computedTheme : theme;
  }
  
  // Updated color scheme:
  // • nonPitText (for header, status, instructions) uses blue/dark-blue
  // • pitText and bankText always white
  // • inactivePitText is a lighter blue variant for unusable pits.
  // • The pit background colors remain fixed.
  getColorScheme() {
    const isDark = this.getComputedTheme() === "dark";
    return {
      // Non-pit text
      heading: isDark ? "text-blue-300" : "text-blue-700",
      nonPitText: isDark ? "text-blue-300" : "text-blue-700",
      // Text inside pits and banks
      pitText: "text-white",
      bankText: "text-white",
      inactivePitText: isDark ? "text-blue-200" : "text-blue-300",
      // Pit and bank background colors (fixed)
      userPit: "bg-blue-800 border border-blue-900 rounded-full",
      userPitHover: "hover:bg-blue-700",
      aiPit: "bg-red-800 border border-red-900 rounded-full",
      inactivePit: "bg-blue-50 border border-blue-100 rounded-full",
      userStore: "bg-blue-700 border border-blue-800 rounded-full",
      aiStore: "bg-red-700 border border-red-800 rounded-full",
      primaryButton: isDark ? "bg-blue-800 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-500",
    };
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (!this.state.gameStarted || this.state.currentPlayer !== "user" || this.state.gameOver)
      return;
    const { key } = e;
    if (key >= "1" && key <= "6") {
      const pitIndex = parseInt(key) - 1;
      if (this.state.board[pitIndex] > 0) {
        this.handleUserMove(pitIndex);
      }
    }
  };

  handleUserMove(pitIndex: number) {
    this.controller.handleUserMove(pitIndex);
  }

  startGame(playerFirst: "user" | "ai") {
    this.controller.resetGame(playerFirst);
    this.setState({ gameStarted: true });
  }

  resetGame() {
    this.setState({ gameStarted: false });
  }

  playAgain() {
    this.controller.resetGame(this.state.started);
  }

  toggleSound() {
    this.setState({ soundEnabled: !this.state.soundEnabled });
  }

  toggleContrast() {
    this.setState({ highContrast: !this.state.highContrast });
  }

  renderPreGameScreen() {
    const { soundEnabled } = this.state;
    const colors = this.getColorScheme();
    const computedTheme = this.getComputedTheme();
    return (
      <div className={`min-h-screen ${computedTheme === "dark" ? "bg-gray-900" : "bg-gray-100"} p-4 md:p-8 flex items-center justify-center`}>
        <div className={`max-w-md w-full ${computedTheme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-8 text-center`}>
          <h1 className={`text-3xl font-bold ${colors.heading} mb-6`}>Mancala</h1>
          <p className={`text-lg ${colors.nonPitText} mb-8`}>
            Choose who goes first:
          </p>
          <div className="space-y-4 mb-8">
            <button 
              onClick={() => this.startGame("user")} 
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200" 
              aria-label="You go first">
              You First
            </button>
            <button 
              onClick={() => this.startGame("ai")} 
              className="w-full bg-red-500 text-white px-6 py-4 rounded-lg text-lg font-medium hover:bg-red-600 transition-colors duration-200" 
              aria-label="AI goes first">
              AI First
            </button>
          </div>
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={this.toggleSound} 
              className={`px-4 py-2 rounded transition-colors duration-200 ${soundEnabled ? `${colors.primaryButton} text-white` : "bg-gray-700 hover:bg-gray-800 text-white"}`} 
              aria-label={`Sound is currently ${soundEnabled ? "on" : "off"}. Click to turn sound ${soundEnabled ? "off" : "on"}`}>
              {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderGameBoard() {
    const { board, currentPlayer, gameOver, message, soundEnabled } = this.state;
    const colors = this.getColorScheme();
    const computedTheme = this.getComputedTheme();
    const isDark = computedTheme === "dark";
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"} p-4 md:p-8 flex justify-center items-center`}>
        <div className="max-w-4xl mx-auto">
          {/* Text and control section */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${colors.heading} mb-4`}>Mancala</h1>
            <div className="space-x-4 mb-4">
              <button
                onClick={this.resetGame}
                className={`${colors.primaryButton} text-white px-4 py-2 rounded transition-colors duration-200`}
                aria-label="Return to start screen"
              >
                New Game
              </button>
              <button
                onClick={this.toggleSound}
                className={`px-4 py-2 rounded transition-colors duration-200 ${soundEnabled ? `${colors.primaryButton} text-white` : "bg-gray-700 hover:bg-gray-800 text-white"}`}
                aria-label={`Sound is currently ${soundEnabled ? "on" : "off"}. Click to turn sound ${soundEnabled ? "off" : "on"}`}
              >
                {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
              </button>
            </div>
            <p className={`text-xl ${gameOver 
                ? (message === "You Win!" 
                  ? "text-green-500 font-bold animate-pulse" 
                  : "text-red-500 font-bold") 
                : colors.nonPitText}`}
               aria-live="polite"
            >
              {message || (currentPlayer === "user" ? "Your Turn" : "AI Thinking...")}
            </p>
          </div>
          {/* Board section wrapped in a wood-style frame */}
          <div
            className="border-8 rounded-xl p-6 shadow-2xl mb-8"
            style={{
              borderColor: "#8B4513",
              backgroundColor: "#DEB887",
            }}
          >
            <div className="flex items-center justify-center gap-4 md:gap-8">
              <div
                className={`w-16 h-32 md:w-20 md:h-40 ${colors.aiStore} flex items-center justify-center ${colors.bankText} text-2xl shadow-lg transition-all`}
                aria-label={`AI's store contains ${board[13]} stones`}
              >
                {board[13]}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 md:gap-4" role="region" aria-label="AI's pits">
                  {[12, 11, 10, 9, 8, 7].map((pitIndex) => (
                    <button
                      key={pitIndex}
                      className={`w-12 h-12 md:w-16 md:h-16 ${colors.aiPit} shadow-md transition-all duration-300 cursor-default flex items-center justify-center ${colors.pitText}`}
                      aria-label={`AI's pit ${12 - pitIndex} contains ${board[pitIndex]} stones`}
                      disabled={true}
                    >
                      {board[pitIndex]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 md:gap-4" role="region" aria-label="Your pits">
                  {[0, 1, 2, 3, 4, 5].map((pitIndex) => (
                    <button
                      key={pitIndex}
                      onClick={() => this.handleUserMove(pitIndex)}
                      disabled={currentPlayer !== "user" || gameOver || !board[pitIndex]}
                      className={`relative group w-12 h-12 md:w-16 md:h-16 ${
                        currentPlayer === "user" && board[pitIndex]
                          ? `${colors.userPit} ${colors.userPitHover} cursor-pointer`
                          : `${colors.inactivePit} cursor-not-allowed`
                      } transition-all duration-300 flex items-center justify-center`}
                      aria-label={`Your pit ${pitIndex + 1} contains ${board[pitIndex]} stones. ${
                        currentPlayer === "user" && board[pitIndex] > 0 ? "Press to move these stones" : "Cannot be selected"
                      }`}
                    >
                      <span className={currentPlayer === "user" && board[pitIndex] ? colors.pitText : colors.inactivePitText} aria-hidden="true">
                        {board[pitIndex]}
                      </span>
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" aria-hidden="true">
                        {pitIndex + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`w-16 h-32 md:w-20 md:h-40 ${colors.userStore} flex items-center justify-center ${colors.bankText} text-2xl shadow-lg transition-all`}
                aria-label={`Your store contains ${board[6]} stones`}
              >
                {board[6]}
              </div>
            </div>
          </div>
          {/* Additional controls and instructions */}
          {gameOver && (
            <div className="mt-8 text-center">
              <button
                onClick={this.playAgain}
                className={`${colors.primaryButton} text-white px-6 py-3 rounded-lg text-lg transition-colors duration-200`}
                aria-label={this.state.started === "user" ? "You go first" : "AI goes first"}
              >
                Play Again
              </button>
            </div>
          )}
          <div className="mt-8 text-center">
            <h2 className={`text-xl font-bold ${colors.heading} mb-2`}>Keyboard Controls</h2>
            <p className="text-blue-700 dark:text-blue-300">
              Press keys <strong>1-6</strong> to select your pits
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.state.gameStarted ? this.renderGameBoard() : this.renderPreGameScreen();
  }
}

export default GameView;