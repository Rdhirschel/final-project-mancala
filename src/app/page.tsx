"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import GameView from "../components/game/GameView";
import Navbar from "../components/layout/navbar";

export default function Page() {
  
  return (
    <ThemeProvider defaultTheme="system">
      <Navbar />
      <GameView />
    </ThemeProvider>
  );
}