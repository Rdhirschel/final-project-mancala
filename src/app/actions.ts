import * as tf from '@tensorflow/tfjs';

let localModel: tf.LayersModel | null = null; // nullable
let modelFilePath = '/assets/tfjs_model/model.json'; // Ensure this path is correct

// Load the converted TensorFlow.js model from local path
async function loadLocalModel(): Promise<tf.LayersModel> 
{
    if (!localModel) 
    {
        // Load the converted TensorFlow.js model
        localModel = await tf.loadLayersModel(modelFilePath);
    }
    return localModel;
}

export async function getAIMove(board: number[]): Promise<number> 
{
    const model = await loadLocalModel();
    
    // Prepare the input tensor from the board state.
    const inputTensor = tf.tensor2d([board], [1, board.length]);

    // Run inference: the model output should be a tensor of shape [1, action_size] (action_size should be 6).
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const qValues = await prediction.data(); // Extract prediction data as array

    // Determine the best valid move (pits 7 to 12 correspond to action indices 0 to 5).
    let bestMove = -1;
    let bestQ = -Infinity;

    // Loop through actions and find the best valid move
    for (let actionIndex = 0; actionIndex < qValues.length; actionIndex++) 
    {
        const pitIndex = 7 + actionIndex;

        // Check if the pit is a valid move.
        if (board[pitIndex] > 0 && qValues[actionIndex] > bestQ) 
        {
            bestQ = qValues[actionIndex];
            bestMove = pitIndex;
        }
    }

    // Fallback: if no valid move is found, return the first available AI pit or default to pit 7.
    if (bestMove === -1)
    {
        for (let pitIndex = 7; pitIndex <= 12; pitIndex++) 
        {
            if (board[pitIndex] > 0) 
            {
                bestMove = pitIndex;
                break;
            }
        }

        if (bestMove === -1)
            bestMove = 7;
    }

    // Dispose tensors to free memory.
    inputTensor.dispose();
    prediction.dispose();

    return bestMove;
}
