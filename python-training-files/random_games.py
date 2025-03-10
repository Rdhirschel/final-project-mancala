from test_agent import test_agent
from DQNAgent import DQNAgent
import matplotlib.pyplot as plt

if __name__ == "__main__":
    agent = DQNAgent(state_size=15, action_size=6)

    wins, losses, ties = test_agent(agent, 0, game_amount=10_000_000) # Symmetric test, since both players are randomized. Ɛ = 1.0. 
                                                                      # No point in testing both positions.

    plt.bar(["Wins", "Losses", "Ties"], [wins, losses, ties])
    plt.title("Results of 10,000,000 random games")
    plt.show()