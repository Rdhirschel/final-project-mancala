from MancalaEnv import *
from DQNAgent import DQNAgent
import matplotlib.pyplot as plt
import random

# Set random seeds for reproducibility
random.seed(42)
np.random.seed(42)

def train_agent(episodes=2000):
    """Trains a DQN agent to play Mancala."""

    agent = DQNAgent(15, 6) # State size = 15: board + current player indicator
    #agent.load_model("mancala_agent_saved.keras") # Load saved model if available
    env = MancalaEnv()
    wins = losses = ties = 0
    rewards = []
    win_loss_history = []
    agent_position = 1
    
    for episode in range(episodes):
        # Randomize starting position for the agent (0 or 1)
        agent_position = 1 - agent_position # Flip every episode for equal training
        state = env.reset(agent_position=agent_position)  # reset now returns full state
        episode_reward = 0
        done = False
        last_action = None
                
        while not done:
            valid_actions = env.available_actions()
            if env.current_player == agent_position:
                # Agent's turn: map valid actions from the full board index to local index
                mapped_actions = [a - 7*agent_position for a in valid_actions]
                action = agent.act(state, mapped_actions)
                last_action = action # Store for the case where the game ends and we need to store the reward
                real_action = action + 7*agent_position
                _, reward = env.make_move(real_action)
                initial_state = state.copy()
                episode_reward += reward

                all_moves = [a for a in range(6)]
                all_invalid = [a for a in all_moves if a not in valid_actions]
                if all_invalid and random.uniform(0,1) <= 0.05: # 5% chance of storing invalid move, to make the agent learn from it
                    random_invalid_for_replay = random.choice(all_invalid)
                    agent.remember(initial_state, random_invalid_for_replay, -300, state, False) # Store invalid move with -300 reward

                if env.done:
                    agent.remember(initial_state, action, reward, state, True) # Terminal state
                
                # If the game is not over, simulate opponent's moves
                if not env.done:
                    while env.current_player != agent_position and not env.done:
                        opp_valid = env.available_actions()
                        if not opp_valid: 
                            _, reward = env.make_move(0) # Just to trigger the end of the game
                            episode_reward += reward
                            agent.remember(initial_state, action, reward, state, True) # Terminal state
                            continue
                        opp_action = random.choice(opp_valid)
                        env.make_move(opp_action)
                
                next_state = env.get_state()  # get updated state with current player indicator
                done = env.done
                
                # Store experience with next_state after opponent's move
                agent.remember(initial_state, action, reward, next_state, done)
                state = next_state
            else:
                opp_valid = env.available_actions()
                if not opp_valid: 
                    env.make_move(0) # Just to trigger the end of the game
                    continue
                opp_action = random.choice(opp_valid)
                env.make_move(opp_action)    
                state = env.get_state()
                done = env.done

                if done:
                    reward = env.calculate_reward(True, agent_position)
                    episode_reward += reward
                    agent.remember(state, last_action, reward, state, done) # Terminal state
            
        # Update win/loss stats
        winner = env.determine_winner_player()
        if winner == agent_position:
            wins += 1
        elif winner is None:
            ties += 1
        else:
            losses += 1
            
        # Update training
        agent.replay()
        win_loss_history.append((wins, losses, ties))
        rewards.append(episode_reward)
        
        # Save model periodically - Checkpoint
        if (episode + 1) % 100 == 0:
            agent.save_model(f"model_saves/mancala_agent_saved.keras")
            
        print(f"Episode: {episode+1}/{episodes} | Wins: {wins} | Losses: {losses} | Ties: {ties} | ε: {agent.epsilon:.3f} | Reward: {episode_reward:.2f} | Position: {agent_position}")


    # Save final model
    agent.save_model("model_saves/mancala_agent_final.keras")

    return rewards, win_loss_history

def plot_graph(rewards, win_loss_history):
    """Plots the training rewards and win/loss/tie distribution."""

    rewards = np.convolve(rewards, np.ones(200) / 200, 'valid')  # Smooth rewards over 200 episodes (moving average)
    plt.figure(figsize=(12, 6))
    plt.plot(rewards, label="Rewards", alpha=0.5)  # Original data in faded blue
    plt.title("Training Rewards with Moving Average (200 episodes)")
    plt.xlabel("Episode")
    plt.ylabel("Total Reward")
    plt.legend()
    plt.show()


    # Plot win/loss/tie distribution over the last 200 episodes
    win_loss_history = np.array(win_loss_history[-201:])
    total_wins = win_loss_history[-1, 0] - win_loss_history[0, 0]
    total_losses = win_loss_history[-1, 1] - win_loss_history[0, 1]
    total_ties = win_loss_history[-1, 2] - win_loss_history[0, 2]

    categories = ["Wins", "Losses", "Ties"]
    values = [total_wins, total_losses, total_ties]

    plt.figure(figsize=(8, 5))
    plt.bar(categories, values, color=["blue", "orange", "green"])
    plt.title("Total Win/Loss/Tie Distribution (Last 200 Episodes)")
    plt.ylabel("Count")
    plt.show()

if __name__ == "__main__":
    rewards, win_loss_history = train_agent()
    plot_graph(rewards, win_loss_history)