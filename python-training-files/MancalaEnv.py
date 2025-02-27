import numpy as np

class MancalaEnv:
    def __init__(self, agent_position=0):
        """Initializes the environment with a given agent_position (0 or 1)."""
        self.agent_position = agent_position
        self.reset(agent_position)

    def reset(self, agent_position=None):
        """Resets the game state and initializes the board."""
        if agent_position is not None:
            self.agent_position = agent_position
        self.board = np.array([4] * 6 + [0] + [4] * 6 + [0], dtype=np.int32)
        self.current_player = 0
        self.done = False
        return self.get_state()

    def get_state(self):
        """Returns the current board state along with the active player."""
        return np.concatenate([self.board.copy(), np.array([self.current_player])])

    def available_actions(self):
        """Returns a list of available moves for the current player."""
        if self.current_player == 0:
            return [i for i in range(0, 6) if self.board[i] > 0]
        return [i for i in range(7, 13) if self.board[i] > 0]

    def make_move(self, action):
        """Executes a move for the current player."""

        if (self.current_player == 0 and np.sum(self.board[:6]) == 0) or (self.current_player == 1 and np.sum(self.board[7:13]) == 0):
            self.board[6] += np.sum(self.board[:6])
            self.board[13] += np.sum(self.board[7:13])
            self.board[:6] = 0
            self.board[7:13] = 0
            self.done = True
            return True, self.calculate_reward(False, 0)

        if not self.is_valid_move(action):
            return False, -300

        seeds = self.board[action]
        self.board[action] = 0
        idx = action
        store = 6 if self.current_player == 0 else 13
        opponent_store = 13 if self.current_player == 0 else 6
        captured = 0

        # Distribute the seeds
        for _ in range(seeds):
            idx = (idx + 1) % 14
            if idx == opponent_store:
                idx = (idx + 1) % 14
            self.board[idx] += 1
            if idx == store:
                captured += 1

        # Check for extra turn or capture
        if idx == store:
            extra_turn = True
        else:
            extra_turn = False
            if (self.board[idx] == 1 and self.board[12 - idx] > 0 and idx // 7 == self.current_player):
                captured += self.board[12 - idx] + 1
                self.board[store] += captured
                self.board[12 - idx] = 0
                self.board[idx] = 0

        if not extra_turn:
            self.current_player = 1 - self.current_player

        reward = self.calculate_reward(extra_turn, captured)
        return True, reward


    def is_valid_move(self, pit_index):
        if self.current_player == 0:
            return 0 <= pit_index < 6 and self.board[pit_index] > 0
        return 7 <= pit_index < 13 and self.board[pit_index] > 0

    def calculate_reward(self, extra_turn, captured):
        """Computes the reward for the player's move."""
        reward = captured * 0.7
        score_diff = self.board[self.agent_position * 7 + 6] - self.board[(1 - self.agent_position) * 7 + 6]
        reward += np.sign(score_diff) * 0.1

        if self.done:
            winner = self.determine_winner_player()
            if winner == self.agent_position:
                reward += 100
            elif winner is None:
                reward += 20
            else:
                reward -= 100

        if extra_turn:
            reward += 1.0

        return reward

    def determine_winner_player(self):
        """Determines the winner based on final scores."""
        if self.board[6] > self.board[13]:
            return 0
        if self.board[13] > self.board[6]:
            return 1
        return None
