import numpy as np

class SumTree:
    def __init__(self, capacity):
        self.capacity = capacity
        self.tree = np.zeros(2 * capacity - 1) # Stores the sum of priorities
        self.data = np.zeros(capacity, dtype=object)
        self.write = 0 # Current index to write data
        self.size = 0 # Current size of the tree


    def _propagate(self, idx, change):
        parent = (idx - 1) // 2
        self.tree[parent] += change
        if parent != 0: # Propagate the change up to the root, unless we are at the root node
            self._propagate(parent, change)

    def _retrieve(self, idx, s):
        left = 2 * idx + 1
        right = left + 1
        if left >= len(self.tree): # If the left child index is out of bounds, we are at a leaf node. Return the current index
            return idx
        if s <= self.tree[left]: # If the s, which is the priority, is less than the left child, we move to the left child. This is because the left child has higher priority, so we want to explore that branch
            return self._retrieve(left, s)
        else: # Otherwise, we move to the right child. We subtract the left child's priority from s, so that we can explore the right child's branch
            return self._retrieve(right, s - self.tree[left])
        
    def total_priority(self):
        return self.tree[0] # The root node stores the total sum of priorities.

    def add(self, priority, data):
        idx = self.write + self.capacity - 1
        self.data[self.write] = data
        self.update(idx, priority)
        self.write = (self.write + 1) % self.capacity # Update the write index to the next position. If we reach the end of the buffer, we wrap around to the beginning
        self.size = min(self.size + 1, self.capacity) # Update the size of the tree, but ensure it does not exceed the capacity

    def update(self, idx, priority):
        change = priority - self.tree[idx] # Calculate the change in priority that needs to be propagated in order to keep the tree structure consistent
        self.tree[idx] = priority
        self._propagate(idx, change)

    def get(self, s):
        idx = self._retrieve(0, s) 
        dataIdx = idx - self.capacity + 1 
        return idx, self.tree[idx], self.data[dataIdx]