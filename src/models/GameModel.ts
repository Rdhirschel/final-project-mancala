//'use server'
type Player = "user" | "ai";

// Defines the game model class
export class GameModel 
{
    board: number[];                        // The board state
    currentPlayer: Player;                  // The current player (user or AI)
    started: Player;                        // The player who started the game
    gameOver: boolean;                      // Flag to indicate if the game is over
    message: string;                        // message to display to the user (Your Turn/AI Thinking.../You Win!/AI Wins!/Tie Game!)
    listeners: (() => void)[];              // List of listeners to notify when the state changes

    // Initialize the game model with the initial state
    constructor() 
    {
        this.board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
        this.currentPlayer = "user";
        this.started = "user";
        this.gameOver = false;
        this.message = "";
        this.listeners = [];
    }

    // Add a listener to the model
    addListener(listener: () => void) : void
    {
        this.listeners.push(listener);
    }

    // Notify all listeners when the state changes
    notifyListeners() : void
    {
        this.listeners.forEach((listener) => listener());
    }

    // Reset the board to the initial state
    resetBoard(initialCurrent: Player = "user", initialMessage?: string) : void
    {
        this.board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
        this.currentPlayer = initialCurrent;
        this.gameOver = false;
        this.started = initialCurrent;
        this.message = initialMessage || (initialCurrent === "user" ? "Your Turn" : "AI Starts"); // Conditionally set the message if not provided
        this.notifyListeners();
    }

    // Check if a move is valid for the current player
    isValidMove(pitIndex: number, player: Player): boolean 
    {
        if (player === "user")
            return pitIndex >= 0 && pitIndex <= 5 && this.board[pitIndex] > 0;
        return pitIndex >= 7 && pitIndex <= 12 && this.board[pitIndex] > 0;
    }

    // Get all valid moves for the current player
    getAllValidMoves(player: Player): number[]
    {
        const validMoves = [];

        // loops through all pits and checks if the move is valid - if so, adds it to the validMoves array
        for (let i = 0; i < 14; i++)
        {
            if (this.isValidMove(i, player))
                validMoves.push(i);
        }

        return validMoves;
    }

    // This method is used to make a move in the game
    makeMove(pitIndex: number) : void
    {
        // if the game is over or the move is invalid, do nothing
        if (this.gameOver || !this.isValidMove(pitIndex, this.currentPlayer))
            return;
        
        const stones = this.board[pitIndex];
        this.board[pitIndex] = 0;
        let currentIndex = pitIndex;
        let lastStoneIndex = -1;

        // Distribute stones
        for (let i = 0; i < stones; i++) 
        {
            currentIndex = (currentIndex + 1) % 14; // Cyclic nature of the board

            // Skip opponent's mancala if user
            if (this.currentPlayer === "user" && currentIndex === 13)
                currentIndex = 0;
            
            // Skip user's mancala if AI
            if (this.currentPlayer === "ai" && currentIndex === 6)
                currentIndex = 7;
            
            // Place stone in the pit
            this.board[currentIndex]++;
            lastStoneIndex = currentIndex;
        }

        // Check for an extra turn
        const extraTurn =
            (this.currentPlayer === "user" && lastStoneIndex === 6) ||
            (this.currentPlayer === "ai" && lastStoneIndex === 13);

        // Stealing rule
        if (!extraTurn && this.board[lastStoneIndex] === 1) 
        {
            // Check if the last stone landed in an empty pit on the player's side
            const isUserSide = this.currentPlayer === "user" && lastStoneIndex >= 0 && lastStoneIndex <= 5;
            const isAiSide = this.currentPlayer === "ai" && lastStoneIndex >= 7 && lastStoneIndex <= 12;

            // If the last stone landed on the player's side and the opposite pit is not empty, steal the stones
            if (isUserSide || isAiSide) 
            {
                const oppositeIndex = 12 - lastStoneIndex;
                const stolenStones = this.board[oppositeIndex];

                if (stolenStones > 0)
                {
                    this.board[lastStoneIndex] = 0;
                    this.board[oppositeIndex] = 0;
                    const mancalaIndex = this.currentPlayer === "user" ? 6 : 13;
                    this.board[mancalaIndex] += stolenStones + 1;
                }
            }
        }

        // Check for game over and update the current player + turn message accordingly
        if (!this.checkGameOver()) 
        {
            if (!extraTurn) 
                this.currentPlayer = this.currentPlayer === "user" ? "ai" : "user";

            this.message = this.currentPlayer === "user" ? "Your Turn" : "AI Thinking...";
        }

        // Notify listeners of the state change
        this.notifyListeners();
    }

    // Check if the game is over and update the state accordingly
    checkGameOver(): boolean 
    {
        const userPits = this.board.slice(0, 6);
        const aiPits = this.board.slice(7, 13);

        // if there exists a pit with stones on both sides, the game is not over
        if (userPits.some((p) => p !== 0) && aiPits.some((p) => p !== 0))
            return false;

        // if there doesn't exist such a pit => the game is over. sum the stones in each pit and add them to their respective store
        const userStones = userPits.reduce((a, b) => a + b, 0);
        const aiStones = aiPits.reduce((a, b) => a + b, 0);
        this.board[6] += userStones;
        this.board[13] += aiStones;

        for (let i = 0; i < 6; i++) 
        {
            this.board[i] = 0;
        }

        for (let i = 7; i < 13; i++) 
        {
            this.board[i] = 0;
        }

        this.gameOver = true;

        // Determine the winner
        if (this.board[6] > this.board[13]) 
            this.message = "You Win!";
        else if (this.board[13] > this.board[6]) 
            this.message = "AI Wins!";
        else 
            this.message = "Tie Game!";

        return true;
    }
}