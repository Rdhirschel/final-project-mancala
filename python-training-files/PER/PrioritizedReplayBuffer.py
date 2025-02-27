import random
import numpy as np
from PER.SumTree import SumTree

# Prioritized Experience Replay Buffer
class PrioritizedReplayBuffer:
    def __init__(self, capacity, alpha=0.6):
        self.tree = SumTree(capacity)
        self.alpha = alpha
        self.epsilon = 1e-5  # To prevent zero priority

    def store(self, experience, priority):
        p = (priority + self.epsilon) ** self.alpha
        self.tree.add(p, experience)

    def sample(self, batch_size, beta=0.4):
        batch = []
        segment = self.tree.total_priority() / batch_size
        priorities = []
        indices = []
        is_weights = np.zeros(batch_size)

        for i in range(batch_size):
            a, b = segment * i, segment * (i + 1)
            s = random.uniform(a, b)
            idx, p, data = self.tree.get(s) 
            priorities.append(p)
            indices.append(idx)
            batch.append(data)
        
        total_p = self.tree.total_priority()
        sampling_probabilities = np.array(priorities) / total_p
        min_probability = np.min(sampling_probabilities)
        is_weights = (min_probability / sampling_probabilities) ** beta

        return batch, indices, is_weights

    def update_priorities(self, indices, errors):
        priorities = (errors + self.epsilon) ** self.alpha
        for idx, p in zip(indices, priorities):
            self.tree.update(idx, p)

    def size(self):
        return self.tree.size
