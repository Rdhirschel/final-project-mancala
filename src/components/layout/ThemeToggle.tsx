"use client";

import { useTheme } from "@/components/ui/ThemeProvider";
import { Sun, Moon, Laptop } from "lucide-react";
import React from "react";

export function ThemeToggle() 
{
    const { theme, setTheme } = useTheme();

    // Return the JSX for the ThemeToggle component.
    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md ${theme === "light"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                    }`}
                aria-label="Use light theme"
            >
                <Sun size={18} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md ${theme === "dark"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                    }`}
                aria-label="Use dark theme"
            >
                <Moon size={18} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-md ${theme === "system"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                    }`}
                aria-label="Use system theme"
            >
                <Laptop size={18} />
            </button>
        </div>
    );
}