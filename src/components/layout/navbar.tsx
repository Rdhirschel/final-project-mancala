'use client';

import React from 'react';
import Link from 'next/link';
import { Github, FileText, BookOpen, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white dark:bg-gray-900 py-3 px-4 md:px-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="text-xl font-bold mr-auto ml-4">Mancala - Final 12th Grade Project by Nir Hirschel</div>
                <div className="flex space-x-4 items-center">
                    <Link href="/" className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                        <Home size={18} />
                        <span className="hidden md:inline">Game</span>
                    </Link>
                    <Link href="/rules" className="flex items-center gap-1 hover:text-blue-300 transition-colors">
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
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;