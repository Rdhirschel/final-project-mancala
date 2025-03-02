"use client";

import * as React from "react";
import { createContext, useContext, useLayoutEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

// Define the props and state for the ThemeProvider component.
type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
};

// Define the state for the ThemeProvider component.
type ThemeProviderState = {
    theme: Theme;
    computedTheme: "dark" | "light";
    setTheme: (theme: Theme) => void;
};

// Define the initial state for the ThemeProvider component.
const initialState: ThemeProviderState = {
    theme: "system",
    computedTheme: "light",
    setTheme: () => null,
};

// Create a new context for the ThemeProvider component. 
// A context is a way to pass data through the component tree without having to pass props down manually at every level.
export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Define the ThemeProvider component.
export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") 
        {
            return (localStorage.getItem("theme") as Theme) || defaultTheme;
        }
        return defaultTheme;
    }); // Initialize the theme state with the default theme.
    const [computedTheme, setComputedTheme] = useState<"dark" | "light">("light"); // Initialize the computed theme state with the light theme.

    // Update the theme when the theme state changes. 
    useLayoutEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        let newTheme: "dark" | "light";

        // Check if the theme is set to "system" and set the theme based on the user's system preference.
        if (theme === "system") 
        {
            // .matches is a boolean that indicates whether the media query is true or false.
            newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } 
        // Set the theme to the specified theme.
        else 
        {
            newTheme = theme;
        }

        // Add the new theme class to the root. The root element is the <html> element in the DOM. 
        root.classList.add(newTheme);

        // Set friendlier CSS variables for a more user-friendly light mode.
        // These variables can be used in your CSS for background, text, etc.
        if (newTheme === "light") {
            root.style.setProperty("--background-color", "#f9fafb"); // Soft light background
            root.style.setProperty("--text-color", "#111827"); // Dark text for readability
        } else {
            root.style.setProperty("--background-color", "#1f2937"); // Refined dark background
            root.style.setProperty("--text-color", "#f3f4f6"); // Light text
        }
        
        setComputedTheme(newTheme);
    }, [theme]);


    // Define the value for the ThemeProvider context.
    const value = {
        theme,
        computedTheme,
        setTheme: (theme: Theme) => {
            localStorage.setItem("theme", theme);
            setTheme(theme);
        },
    };

    // Return the JSX for the ThemeProvider component.
    return (
        // The ThemeProvider component provides the theme state and setTheme function to its children using the ThemeProviderContext.Provider.
        // The ThemeProviderContext.Provider is a special component that allows consuming components to subscribe to context changes.
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

// Define a custom hook (function) that allows components to access the theme state and setTheme function.
export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) 
    {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};