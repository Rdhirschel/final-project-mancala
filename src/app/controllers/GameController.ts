//"use server";
import { GameModel } from '../models/GameModel';
import { getAIMove } from '../actions';

type Player = 'user' | 'ai';

export class GameController {
    model: GameModel;
    aiThinkingTimeout: NodeJS.Timeout | null = null;

    constructor(model: GameModel) {
        this.model = model;
    }

    async processAIMove() 
    {
        try {
            // Set the AI thinking message
            this.model.message = "AI Thinking...";
            this.model.notifyListeners();
            
            // Add a delay to make AI move visible and create a better user experience
            if (this.aiThinkingTimeout) {
                clearTimeout(this.aiThinkingTimeout);
            }
            
            this.aiThinkingTimeout = setTimeout(async () => {
                const player_indicator = this.model.started === 'user' ? 1 : 0;
                const reqParams: number[] = [...this.model.board, player_indicator];
                
                try {
                    const aiMoves = await getAIMove(reqParams);
                    console.log("best AI moves: " + aiMoves);
                    
                    for (let i = 0; i < aiMoves.length; i++) {
                        const moveIndex = aiMoves[i] + 7 * player_indicator;
                        console.log(this.model.isValidMove(moveIndex, 'ai'));
                        
                        if (this.model.isValidMove(moveIndex, 'ai')) {
                            this.model.makeMove(moveIndex);
                            
                            // If AI gets another turn, wait a bit before next move
                            if (this.model.currentPlayer === 'ai' && !this.model.gameOver) {
                                setTimeout(() => {
                                    this.processAIMove();
                                }, 800); // Delay between consecutive AI moves
                            }
                            break;
                        }
                    }
                } catch (error) {
                    console.error('AI move error:', error);
                    // Fallback to random move if API fails
                    this.makeRandomAIMove();
                }
            }, 1000); // Initial AI thinking delay
        }
        catch (error : any) {
            console.error('AI move error:', error);
            this.makeRandomAIMove();
        }
    }
    
    makeRandomAIMove() {
        const validMoves = this.model.getAllValidMoves('ai');
        if (validMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * validMoves.length);
            this.model.makeMove(validMoves[randomIndex]);
            
            if (this.model.currentPlayer === 'ai' && !this.model.gameOver) {
                setTimeout(() => {
                    this.processAIMove();
                }, 800);
            }
        }
    }

    handleUserMove(pitIndex: number) {
        // Ensure it's the user's turn and the game is not over.
        if (this.model.currentPlayer !== 'user' || this.model.gameOver)
            return;

        this.model.makeMove(pitIndex);

        // Re-read the current player with an assertion to refresh the union type.
        const updatedPlayer = this.model.currentPlayer as 'user' | 'ai';
        if (updatedPlayer === 'ai' && !this.model.gameOver)
            this.processAIMove();
    }

    resetGame(playerFirst: Player) {
        // Clear any pending AI move
        if (this.aiThinkingTimeout) {
            clearTimeout(this.aiThinkingTimeout);
        }
        
        this.model.resetBoard(playerFirst, playerFirst === 'user' ? 'Your Turn' : 'AI Starts');
        if (playerFirst === 'ai')
            this.processAIMove();
    }
}