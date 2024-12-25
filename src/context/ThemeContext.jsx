// src/context/ThemeContext.js

import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// Create a Theme Context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check local storage for theme preference
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Save theme preference to local storage and apply to body
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.body.classList.toggle('dark', isDarkMode); // Apply dark class to body
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Define prop types for ThemeProvider
ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate children prop
};

// Custom hook to use the Theme Context
export const useTheme = () => {
    return useContext(ThemeContext);
};