'use client';

import React from 'react';
import Navbar from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import Layout from "@/app/layout"
import Image from 'next/image';

const Rules = () => {
  return (
    <Layout>
      <ThemeProvider>
        <div className="min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors">
          <Navbar />
          
          <div className="max-w-5xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-700 dark:text-blue-300">
              Mancala Rules
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-slate-300 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 border-b-4 border-blue-700 dark:border-blue-300 pb-2">
                Game Setup
              </h2>
              <p className="mb-6 text-xl text-blue-700 dark:text-blue-300 font-medium">
                The Mancala board consists of two rows of six pits each, with a larger store at each end.
                At the beginning of the game, four stones are placed in each of the twelve smaller pits.
              </p>
              
                <div className="my-10 flex justify-center">
                <Image 
                  src="/images/mancala_board.png" 
                  className="rounded-lg shadow-lg" 
                  alt="Mancala board" 
                  width={600} 
                  height={400} 
                  priority
                />
                </div>
              
              <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 border-b-4 border-blue-700 dark:border-blue-300 pb-2">
                Objective
              </h2>
              <p className="mb-6 text-xl text-blue-700 dark:text-blue-300 font-medium">
                The goal is to collect more stones in your store than your opponent by the end of the game.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 border-b-4 border-blue-700 dark:border-blue-300 pb-2">
                Game Play
              </h2>
              <ol className="list-decimal pl-8 space-y-4 mb-8 text-lg">
                <li className="p-4 bg-slate-800 dark:bg-slate-700 dark:text- rounded font-medium">
                  <strong className="text-yellow-300 text-xl">Moving Stones:</strong> On your turn, select one of the pits on your side of the board. All stones from that pit are picked up and distributed one by one counterclockwise into each pit, including your own store but skipping your opponent&apos;s store.
                </li>
                <li className="p-4 bg-slate-800 dark:bg-slate-700 rounded font-medium">
                  <strong className="text-yellow-300 text-xl">Extra Turn:</strong> If the last stone you drop lands in your own store, you get another turn.
                </li>
                <li className="p-4 bg-slate-800 dark:bg-slate-700 rounded font-medium">
                  <strong className="text-yellow-300 text-xl">Capturing Stones:</strong> If the last stone you drop lands in an empty pit on your side, you capture that stone and all stones in the pit directly opposite on your opponent&apos;s side. All captured stones go into your store.
                </li>
                <li className="p-4 bg-slate-800 dark:bg-slate-700 rounded font-medium">
                  <strong className="text-yellow-300 text-xl">Game End:</strong> The game ends when all six pits on one side of the board are empty. The player who still has stones on their side captures those stones and adds them to their store.
                </li>
                <li className="p-4 bg-slate-800 dark:bg-slate-700 rounded font-medium">
                  <strong className="text-yellow-300 text-xl">Winning:</strong> The player with the most stones in their store at the end of the game wins.
                </li>
              </ol>
              
              <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 border-b-4 border-blue-700 dark:border-blue-300 pb-2">
                Strategy Tips
              </h2>
              <ul className="list-disc pl-8 space-y-3 text-lg">
                <li className="p-4 bg-yellow-600 dark:bg-yellow-700 text-white rounded font-medium">
                  Try to end your turn in your bank to get an extra move
                </li>
                <li className="p-4 bg-yellow-600 dark:bg-yellow-700 text-white rounded font-medium">
                  Keep track of how many stones are in each pit to plan captures
                </li>
                <li className="p-4 bg-yellow-600 dark:bg-yellow-700 text-white rounded font-medium">
                  Sometimes it&apos;s better to keep stones on your side to set up future moves
                </li>
                <li className="p-4 bg-yellow-600 dark:bg-yellow-700 text-white rounded font-medium">
                  Sabotaging the Enemy moves by distributing stones on their side can be beneficial
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Layout>
  );
};

export default Rules;