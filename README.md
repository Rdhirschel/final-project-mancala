# Final Project Mancala

## Overview

The Final Project Mancala is designed as a web-based version of the classic Mancala game. It features:

- A responsive UI with dynamic theme support (dark, light, or system).
- Game logic managed using React state and controllers.
- An AI opponent trained using Python scripts.

The AI moves are backed by machine learning algorithms that were developed and trained in the [`python-training-files`](./python-training-files) directory. Key training files such as [`DQNAgent.py`](./python-training-files/DQNAgent.py) and [`train.py`](./python-training-files/train.py) were used to optimize the agent’s strategy.

For further details on the project documentation including development decisions and game rules, you can refer to the docs page linked in the navbar.

## Project Structure

- **src/**  
    Contains the main application code that initializes the website including:
    - **components/** – UI components such as the game board, navbar, and theme provider.
    - **app/** – Next.js pages and global styles.
    - **controllers/** and **models/** – Manage game logic and state.

- **python-training-files/**  
    Includes the Python scripts used to train the AI opponent. Below is a brief overview:
    - **Agent Definition & Model Architecture:**  
        The core AI is implemented in [`DQNAgent.py`](./python-training-files/DQNAgent.py). This file defines the agent using a dueling DQN architecture with methods such as `act`, `remember`, and `replay` for playing and learning during training.
    
    - **Prioritized Experience Replay & Dueling DQN:**  
        The project leverages prioritized experience replay. Supporting modules such as [`SumTree.py`](./python-training-files/PER/SumTree.py) and [`PrioritizedReplayBuffer.py`](./python-training-files/PER/PrioritizedReplayBuffer.py) implement the data structures and algorithms required for efficient sampling and storage of training experiences.
    
    - **Training and Testing:**  
        The training loop is managed in [`train.py`](./python-training-files/train.py). This script sets up the training environment, instantiates the AI agent, and runs episodes where the agent learns from game interactions. The model is periodically saved (e.g., to `model_saves/mancala_agent_saved.keras`). Testing scripts, such as [`agent_testing.py`](./python-training-files/agent_testing.py), are used to evaluate the agent's performance under various conditions.
    
    - **Other Files:**  
        Additional scripts offer utility functions for random gameplay, performance metrics, and visualization of learning trends.

- **server/main.py:**  
    This file contains the API needed by the project. It provides endpoints that may handle requests from the frontend, such as game state updates or processing moves by the AI. This API file serves as an interface between the client-side application and any server-side logic required by the game. The API is hosted [under this repository](https://github.com/Rdhirschel/python-api-mancala)

- **public/**  
    Hosts static assets such as images, sounds, and icons.

- **requirements.txt:**  
    Contains Python dependencies:
    fastapi
    tensorflow==2.18.0
    numpy
    matplotlib
    onnxruntime
    tf2onnx
    onnx

- **package.json:**  
Manages the frontend dependencies such as Next.js, React, Tailwind CSS, and Lucide Icons.

## Running the Project Locally

Follow these steps to set up and run the entire project on your local machine.

### 1. Install Dependencies

#### Frontend (Next.js)
- Open a terminal in the project root.
- Install Node.js packages with:
    ```bash
    npm install
    ```
    This installs all necessary packages listed in package.json.

#### Backend (Python)
- Install Python dependencies with:
    ```bash
    pip install -r requirements.txt
    ```

### 2. Running the Backend Server
- In the activated virtual environment, start the backend server by running:
    ```bash
    fastapi dev server/main.py
    ```
- This should initialize the API endpoints needed by the project.

### 3. Running the Frontend Application

- In a separate terminal (with Node.js installed), start the Next.js development server:
    ```bash
    npm run dev
    ```
- Open your browser at [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Additional Notes

- Ensure that both the backend and frontend are running simultaneously for full functionality.
- Refer to any additional comments within the code for a deeper explanation on how everything works
