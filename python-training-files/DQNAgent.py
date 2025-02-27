import os 
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import numpy as np
import random
import tensorflow as tf
from tensorflow.keras import Model                                                          # type: ignore
from tensorflow.keras.layers import Dense, Input, Lambda, Dropout, BatchNormalization       # type: ignore
from tensorflow.keras.regularizers import l2                                                # type: ignore
from tensorflow.keras.optimizers import Adam                                                # type: ignore
from tensorflow.keras.utils import register_keras_serializable                              # type: ignore
from PER.PrioritizedReplayBuffer import PrioritizedReplayBuffer

@register_keras_serializable()
def _combine_streams(inputs):
    val, adv = inputs
    return val + (adv - tf.reduce_mean(adv, axis=1, keepdims=True))

# Set random seeds for reproducibility
random.seed(42)
np.random.seed(42)
tf.random.set_seed(42)

class DQNAgent:
    def __init__(self, state_size, action_size, learning_rate=0.001):
        """Initialize the DQN Agent."""
        self.state_size = state_size          # Size of input state
        self.action_size = action_size        # Number of possible actions
        self.memory = PrioritizedReplayBuffer(capacity=100_000, alpha=0.6)
        self.gamma = 0.97                   # Discount factor
        self.epsilon = 1.0                  # Initial exploration rate
        self.epsilon_min = 0.01             # Minimum exploration rate
        self.epsilon_decay = 0.995          # Decay rate for exploration
        self.batch_size = 256               # Training batch size
        self.update_target_freq = 25        # Frequency of target model updates
        self.beta = 0.6                     # Importance sampling exponent
        self.beta_max = 0.95                # Max value for beta
        self.beta_increment = 0.01          # Increment for beta
        self.model = self._build_model(learning_rate)
        self.target_model = self._build_model(learning_rate)
        self._update_target_model()
        self.training_step = 0

    def _build_model(self, lr):
        """Builds a dueling DQN model for Q-learning."""
        input_layer = Input(shape=(self.state_size,))
        
        x = Dense(512, activation='relu6', kernel_initializer='he_uniform')(input_layer)
        x = Dense(256, activation='relu6', kernel_initializer='he_uniform')(x)
        common = Dense(128, activation='relu6', kernel_initializer='he_uniform')(x)
        
        # Value stream
        value_fc = Dense(64, activation='relu6', kernel_initializer='he_uniform')(common)
        value_fc = Dense(32, activation='relu6', kernel_initializer='he_uniform')(value_fc)
        value_fc = Dense(16, activation='relu6', kernel_initializer='he_uniform')(value_fc)
        value = Dense(1, activation='linear', kernel_initializer='he_uniform')(value_fc)
        
        # Advantage stream
        adv_fc = Dense(64, activation='relu6', kernel_initializer='he_uniform')(common)
        adv_fc = Dense(32, activation='relu6', kernel_initializer='he_uniform')(adv_fc)
        advantage = Dense(self.action_size, activation='linear', kernel_initializer='he_uniform')(adv_fc)
        
        # Combine the streams
        q_values = Lambda(_combine_streams)([value, advantage])
        model = Model(inputs=input_layer, outputs=q_values)
        model.compile(optimizer=Adam(learning_rate=lr), loss='huber')
        return model

    def _update_target_model(self):
        """Updates the target model with the weights of the main model."""
        self.target_model.set_weights(self.model.get_weights())

    def remember(self, state, action, reward, next_state, done):
        """Stores experience in memory with priority."""
        priority = 1.0  # Assign high priority to new samples
        self.memory.store((state, action, reward, next_state, done), priority)

    def act(self, state, valid_actions):
        """Selects an action using an epsilon-greedy policy."""
        if not valid_actions:
            return -1

        # Epsilon-greedy policy
        if np.random.rand() <= self.epsilon:
            return random.choice(valid_actions)

        state = state.reshape(1, -1)
        act_values = self.model.predict(state, verbose=0)
        return valid_actions[np.argmax([act_values[0][a] for a in valid_actions])]

    def replay(self):
        """Trains the model using experiences from memory."""
        if self.memory.size() < self.batch_size:
            return

        minibatch, indices, is_weights = self.memory.sample(self.batch_size, beta=self.beta)
        states = np.array([x[0] for x in minibatch])
        next_states = np.array([x[3] for x in minibatch])
        targets = self.model.predict(states, verbose=0)
        next_q = self.target_model.predict(next_states, verbose=0)
        
        errors = np.zeros(self.batch_size)

        # Update target Q-value using the Bellman equation for each sample.
        for i, (_, a, r, _, done) in enumerate(minibatch):
            if done:
                target = r
            else:
                target = r + self.gamma * np.max(next_q[i])
            errors[i] = abs(targets[i][a] - target)
            targets[i][a] = target

        self.memory.update_priorities(indices, errors)
        self.model.fit(states, targets, batch_size=self.batch_size, sample_weight=is_weights, verbose=0)

        self.training_step += 1
        if self.training_step % self.update_target_freq == 0:
            self._update_target_model()
            print("Target model updated")
        
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)
        self.beta = min(self.beta_max, self.beta + self.beta_increment) 

    def save_model(self, name):
        """Saves the model to a file."""
        self.model.save(name)

    def load_model(self, name):
        """Loads a saved model from a file."""
        # Pass custom_objects to help Keras locate the globally defined combine_streams function.
        custom_objects = {"combine_streams": _combine_streams}
        self.model = tf.keras.models.load_model(name, custom_objects=custom_objects)
        self.target_model = tf.keras.models.load_model(name, custom_objects=custom_objects)