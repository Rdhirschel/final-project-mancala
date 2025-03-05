"use client";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import GameView from "@/components/game/GameView";
import Navbar from "@/components/layout/navbar";
import Layout from "@/app/layout";

export default function Page() {
  
  return (
    <Layout >
        <Navbar />
        <GameView />
    </Layout>
  );
}