'use server'
import axios from 'axios';

const apiUrlGlobal = '';
const apiUrlLocal = 'http://127.0.0.1:8000/best_move/';
const apiUrl = process.env.NODE_ENV === 'production' ? apiUrlGlobal : apiUrlLocal;

export async function getAIMove(board: number[]): Promise<number[]> {
    try 
    {
        console.log("Board state:", board);
        const response = await axios.post(apiUrl, {
            state: board
        });

        if (response.status === 200) 
        {
            return response.data.best_moves;
        } 
        
        else 
        {
            throw new Error(`API request failed with status code ${response.status}`);
        }
    } 
    
    catch (error) 
    {
        console.error('Error fetching AI move');
        console.warn('Falling back to random move - API request failed. Try running the API server.');
        throw error;
    }
}