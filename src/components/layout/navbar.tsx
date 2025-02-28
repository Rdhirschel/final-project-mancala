'use client';

import React from 'react';
import Link from 'next/link';
import { Github, FileText, BookOpen, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/components/ui/theme-provider';

const Navbar = () => {
  const { computedTheme } = useTheme();

  // Dynamically set the navbar style based on the current theme.
  const navbarClass =
    computedTheme === 'dark'
      ? 'bg-gray-950 text-gray-200'
      : 'bg-gray-900 text-white';

  return (
    <nav className={`${navbarClass} py-4 px-8`}>
      <div className="w-full flex items-center">
        {/* Left section: Title */}
        <div className="flex-1">
          <div className="text-xl font-bold">
            Mancala - Final 12th Grade Project by Nir Hirschel
          </div>
        </div>
        {/* Center section: Navigation links */}
        <div className="flex-1 flex justify-center space-x-4">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-300 transition-colors"
          >
            <Home size={18} />
            <span className="hidden md:inline">Game</span>
          </Link>
          <Link
            href="/rules"
            className="flex items-center gap-1 hover:text-blue-300 transition-colors"
          >
            <BookOpen size={18} />
            <span className="hidden md:inline">Rules</span>
          </Link>
          <Link
            href="https://github.com/rdhirschel/final-project-mancala"
            target="_blank"
            className="flex items-center gap-1 hover:text-blue-300 transition-colors"
          >
            <Github size={18} />
            <span className="hidden md:inline">GitHub</span>
          </Link>
          <Link
            href="https://docs.google.com/document/d/17jNGiX-QGyQlGccvVtcJ8Xz7jYCdLEzpi0tiBfmz0lk/edit?tab=t.0#heading=h.2m8h9b1p9ax"
            target="_blank"
            className="flex items-center gap-1 hover:text-blue-300 transition-colors"
          >
            <FileText size={18} />
            <span className="hidden md:inline">Docs</span>
          </Link>
        </div>
        {/* Right section: Theme toggle */}
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;