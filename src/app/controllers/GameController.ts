import { GameModel } from '../models/GameModel';
import { getAIMove } from '../actions';

type Player = 'user' | 'ai';

export class GameController 
{
    model: GameModel;

    constructor(model: GameModel) 
    {
        this.model = model;
    }

    async processAIMove() 
    {
        try 
        {
            const aiMove = await getAIMove(this.model.board);
            if (this.model.isValidMove(aiMove, 'ai')) 
            {
                this.model.makeMove(aiMove);

                // Process additional AI turns if needed
                if (this.model.currentPlayer === 'ai' && !this.model.gameOver)
                    this.processAIMove();
            }
        } 
        
        catch (error) 
        {
            console.error('AI move error:', error);
        }
    }
    
    handleUserMove(pitIndex: number) 
    {
        // Ensure it's the user's turn and the game is not over.
        if (this.model.currentPlayer !== 'user' || this.model.gameOver)
            return;

        this.model.makeMove(pitIndex);

        // Re-read the current player with an assertion to refresh the union type.
        const updatedPlayer = this.model.currentPlayer as 'user' | 'ai';

        if (updatedPlayer === 'ai' && !this.model.gameOver)
            this.processAIMove();
    }


    resetGame(playerFirst: Player) 
    {
        this.model.resetBoard(playerFirst, playerFirst === 'user' ? 'Your Turn' : 'AI Starts');
        if (playerFirst === 'ai')
            this.processAIMove();
    }
}
