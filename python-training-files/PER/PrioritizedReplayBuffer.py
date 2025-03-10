import random
import numpy as np
from PER.SumTree import SumTree

# Prioritized Experience Replay Buffer
class PrioritizedReplayBuffer:
    def __init__(self, capacity, alpha=0.6):
        """Initializes the Prioritized Replay Buffer."""
        self.tree = SumTree(capacity)
        self.alpha = alpha
        self.epsilon = 1e-5  # To prevent zero priority

    def store(self, experience, priority):
        """Stores experience with priority in the buffer."""
        p = (priority + self.epsilon) ** self.alpha
        self.tree.add(p, experience)

    def sample(self, batch_size, beta=0.4):
        """Samples a batch of experiences from the buffer."""
        batch = []
        segment = self.tree.total_priority() / batch_size
        priorities = []
        indices = []
        is_weights = np.zeros(batch_size)

        for i in range(batch_size):
            # Sample a value uniformly from each segment
            a, b = segment * i, segment * (i + 1)
            s = random.uniform(a, b)
            idx, p, data = self.tree.get(s) 
            priorities.append(p)
            indices.append(idx)
            batch.append(data)
        
        # Compute importance-sampling weights according to the PER formula
        total_p = self.tree.total_priority()
        sampling_probabilities = np.array(priorities) / total_p
        min_probability = np.min(sampling_probabilities)
        is_weights = (min_probability / sampling_probabilities) ** beta

        return batch, indices, is_weights

    def update_priorities(self, indices, errors):
        """Updates the priorities of the experiences in the buffer. It does this by updating the SumTree with the new priorities."""
        priorities = (errors + self.epsilon) ** self.alpha
        for idx, p in zip(indices, priorities):
            self.tree.update(idx, p)

    def size(self):
        """Returns the current size of the buffer."""
        return self.tree.size