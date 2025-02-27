"""
Endpoint to get the best move for the given board state.
Args:
    board_state (BoardState): The current state of the board, expected to be a list or array of length 15.
Returns:
    dict: A dictionary containing the best move with the key "best_move".
Raises:
    HTTPException: If the input shape is not (15,) or if there is any other error during processing.
"""

import os 
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
from tensorflow.keras.utils import register_keras_serializable # type: ignore

@register_keras_serializable()
def _combine_streams(inputs):
    val, adv = inputs
    return val + (adv - tf.reduce_mean(adv, axis=1, keepdims=True))

app = FastAPI()

# Load the trained model
model_path = "public/assets/mancala_agent_final.keras"
custom_objects = {"combine_streams": _combine_streams}
agent = tf.keras.models.load_model(model_path, custom_objects=custom_objects)

class BoardState(BaseModel):
    state: list

@app.get("/")
def read_root():
    return {"message": "Mancala Agent API"}

@app.post("/best_move/")
def get_best_move(board_state: BoardState):
    try:
        state = np.array(board_state.state)
        if state.shape[0] != 15:
            raise HTTPException(status_code=400, detail="Input shape must be (15,)")
        state = state.reshape(1, -1)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")
    
    act_values = agent.predict(state, verbose=0)

    # create a list of all of the best moves by order
    best_moves = np.argsort(act_values[0])[::-1].tolist()

    return {"best_moves": best_moves}