import GameView from "@/components/game/GameView";
import Navbar from "@/components/layout/navbar";
import Layout from "@/app/layout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mancala Game | Mancala by Nir Hirschel',
  description: 'Play Mancala online against an AI opponent.',
}

export default function Page() {
  
  return (
    <Layout >
        <Navbar />
        <GameView />
    </Layout>
  );
}