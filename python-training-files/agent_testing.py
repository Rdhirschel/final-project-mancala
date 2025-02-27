from DQNAgent import DQNAgent
from test_agent import test_agent

if __name__ == "__main__":
    agent = DQNAgent(state_size=15, action_size=6)
    agent.load_model("mancala_agent_final.keras")

    agent.epsilon = 0.0
    agent.epsilon_min = 0.0
    agent.epsilon_decay = 1.0

    wins, losses, ties = test_agent(agent, 0, game_amount=500)
    wins, losses, ties = test_agent(agent, 1, game_amount=500)