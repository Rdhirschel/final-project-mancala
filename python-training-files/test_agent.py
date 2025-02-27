from MancalaEnv import MancalaEnv
import random
import numpy as np

# Set random seeds for reproducibility
random.seed(45)
np.random.seed(45)

def test_agent(agent, position, game_amount=5_000):
    """Evaluates the agent's performance over a set number of games."""
    
    env = MancalaEnv(position)  # Initialize Mancala environment
    wins = losses = ties = 0

    for _ in range(game_amount):
        state = env.reset()  # Reset environment for a new game

        while not env.done:
            valid = env.available_actions()  # Get valid actions
            
            if env.current_player == position:
                # Convert valid actions to a local index [0-5] based on position
                mapped = [v - 7 * position for v in valid]
                action = agent.act(state, mapped)  # Agent selects action
                real_action = action + 7 * position  # Convert back to board index
                env.make_move(real_action)  # Execute move
                state = env.get_state()  # Update state
            else:
                if not valid:
                    break
                # Opponent selects a random move
                mapped = [v - 7 * (1 - position) for v in valid]
                action = random.choice(mapped)
                real_action = action + 7 * (1 - position)
                env.make_move(real_action)
                state = env.get_state()

        # Determine game outcome based on final board state
        if env.board[6] > env.board[13] and position == 0:
            wins += 1
        elif env.board[6] < env.board[13] and position == 1:
            wins += 1
        elif env.board[6] < env.board[13] and position == 0:
            losses += 1
        elif env.board[6] > env.board[13] and position == 1:
            losses += 1
        else:
            ties += 1

    print(f"Position {position} - Wins: {wins}, Losses: {losses}, Ties: {ties}")

    return wins, losses, ties
