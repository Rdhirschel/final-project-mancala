//'use server'
type Player = "user" | "ai";

export class GameModel 
{
    board: number[];
    currentPlayer: Player;
    started: Player;
    gameOver: boolean;
    message: string;
    listeners: (() => void)[];
    lastMovedPit: number | null;

    constructor() 
    {
        this.board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
        this.currentPlayer = "user";
        this.started = "user";
        this.gameOver = false;
        this.message = "";
        this.listeners = [];
        this.lastMovedPit = null;
    }

    addListener(listener: () => void) 
    {
        this.listeners.push(listener);
    }

    notifyListeners() 
    {
        this.listeners.forEach((listener) => listener());
    }

    resetBoard(initialCurrent: Player = "user", initialMessage?: string) 
    {
        this.board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
        this.currentPlayer = initialCurrent;
        this.gameOver = false;
        this.started = initialCurrent;
        this.lastMovedPit = null;
        this.message =
            initialMessage || (initialCurrent === "user" ? "Your Turn" : "AI Starts"); // Conditionally set the message if not provided
        this.notifyListeners();
    }

    isValidMove(pitIndex: number, player: Player): boolean 
    {
        if (player === "user")
            return pitIndex >= 0 && pitIndex <= 5 && this.board[pitIndex] > 0;
        return pitIndex >= 7 && pitIndex <= 12 && this.board[pitIndex] > 0;
    }

    getAllValidMoves(player: Player): number[]
    {
        const validMoves = [];
        for (let i = 0; i < 14; i++)
        {
            if (this.isValidMove(i, player))
                validMoves.push(i);
        }
        return validMoves;
    }

    makeMove(pitIndex: number) 
    {
        if (this.gameOver || !this.isValidMove(pitIndex, this.currentPlayer))
            return;

        this.lastMovedPit = pitIndex;
        
        let stones = this.board[pitIndex];
        this.board[pitIndex] = 0;
        let currentIndex = pitIndex;
        let lastStoneIndex = -1;

        // Distribute stones
        for (let i = 0; i < stones; i++) 
        {
            currentIndex = (currentIndex + 1) % 14;
            if (this.currentPlayer === "user" && currentIndex === 13)
                currentIndex = 0;

            if (this.currentPlayer === "ai" && currentIndex === 6)
                currentIndex = 7;

            this.board[currentIndex]++;
            lastStoneIndex = currentIndex;
        }

        // Update lastMovedPit to the final position
        this.lastMovedPit = lastStoneIndex;

        // Check for an extra turn
        const extraTurn =
            (this.currentPlayer === "user" && lastStoneIndex === 6) ||
            (this.currentPlayer === "ai" && lastStoneIndex === 13);

        // Stealing rule
        if (!extraTurn && this.board[lastStoneIndex] === 1) 
        {
            // Check if the last stone landed in an empty pit on the player's side
            const isUserSide =
                this.currentPlayer === "user" &&
                lastStoneIndex >= 0 &&
                lastStoneIndex <= 5;
            const isAiSide =
                this.currentPlayer === "ai" &&
                lastStoneIndex >= 7 &&
                lastStoneIndex <= 12;

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

        this.notifyListeners();
    }

    checkGameOver(): boolean 
    {
        const userPits = this.board.slice(0, 6);
        const aiPits = this.board.slice(7, 13);

        if (userPits.some((p) => p !== 0) && aiPits.some((p) => p !== 0))
            return false;

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
        if (this.board[6] > this.board[13]) 
            this.message = "You Win!";
        else if (this.board[13] > this.board[6]) 
            this.message = "AI Wins!";
        else 
            this.message = "Tie Game!";

        return true;
    }
}