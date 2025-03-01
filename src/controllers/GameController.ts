//"use server";
import { GameModel } from '../models/GameModel';
import { getAIMove } from '../app/actions';

type Player = 'user' | 'ai';

export class GameController {

    // The game model instance.
    model: GameModel;

    // Timeout for AI thinking delay.
    aiThinkingTimeout: NodeJS.Timeout | null = null;

    // Initialize the GameController with the game model.
    constructor(model: GameModel) 
    {
        this.model = model;
    }

    // This method processes the AI move. It sends a request to the API to get the best move for the AI player.
    async processAIMove() 
    {
        try 
        {
            // Set the AI thinking message
            this.model.message = "AI Thinking...";
            this.model.notifyListeners();

            // Add a delay to make AI move visible and create a better user experience
            if (this.aiThinkingTimeout) 
            {
                clearTimeout(this.aiThinkingTimeout);
            }
            
            // Set a timeout for the AI thinking delay. Used to simulate the AI thinking process and make the AI moves clearer.
            this.aiThinkingTimeout = setTimeout(async () => {
                const player_indicator = this.model.started === 'user' ? 1 : 0;

                // reqParams: [board, player_indicator] to the API
                const reqParams: number[] = [...this.model.board, player_indicator];
                
                try {
                    // Get the best AI moves from the API
                    const aiMoves = await getAIMove(reqParams);

                    // The API returns a list of the best moves by order. We iterate over the moves and make the first valid move.
                    for (let i = 0; i < aiMoves.length; i++) 
                    {
                        // Although in the training we had switched according to the position, here visually the agent is always the one above
                        const moveIndex = aiMoves[i] + 7; 
                        console.log(this.model.isValidMove(moveIndex, 'ai'));
                        if (this.model.isValidMove(moveIndex, 'ai')) 
                        {
                            this.model.makeMove(moveIndex);

                            // If AI gets another turn, wait a bit before next move
                            if (this.model.currentPlayer === 'ai' && !this.model.gameOver) 
                            {
                                setTimeout(() => {
                                    this.processAIMove();
                                }, 800); // Delay between consecutive AI moves
                            }
                            break;
                        }
                    }
                } 
                
                // If there is an error in the API request, fallback to random move
                catch (error) {
                    console.error('AI move error:', error);
                    // Fallback to random move if API fails
                    this.makeRandomAIMove();
                }
            }, 1000); // Initial AI thinking delay
        }

        // if there is an error in the API request, fallback to random move
        catch (error: any) {
            console.error('AI move error:', error);
            this.makeRandomAIMove();
        }
    }

    // This method makes a random move for the AI player. Used as a fallback when the API request fails.
    makeRandomAIMove() 
    {
        const validMoves = this.model.getAllValidMoves('ai');
        if (validMoves.length > 0)
        {
            const randomIndex = Math.floor(Math.random() * validMoves.length);
            this.model.makeMove(validMoves[randomIndex]);

            if (this.model.currentPlayer === 'ai' && !this.model.gameOver) 
            {
                setTimeout(() => { this.processAIMove(); }, 800);
            }
        }
    }

    // This method handles the user move. It checks if it's the user's turn and the game is not over before making a move.
    handleUserMove(pitIndex: number) 
    {
        // Ensure it's the user's turn and the game is not over.
        if (this.model.currentPlayer !== 'user' || this.model.gameOver)
            return;

        // Make the user move
        this.model.makeMove(pitIndex);

        // Re-read the current player with an assertion to refresh the union type.
        const updatedPlayer = this.model.currentPlayer as 'user' | 'ai';
        if (updatedPlayer === 'ai' && !this.model.gameOver)
            this.processAIMove();
    }

    resetGame(playerFirst: Player) 
    {
        // Clear any pending AI move
        if (this.aiThinkingTimeout)
            clearTimeout(this.aiThinkingTimeout);

        // Reset the game board and start the game with the specified player.
        this.model.resetBoard(playerFirst, playerFirst === 'user' ? 'Your Turn' : 'AI Starts');
        if (playerFirst === 'ai')
            this.processAIMove();
    }
}