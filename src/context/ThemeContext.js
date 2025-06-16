'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

// Create a context for managing theme
const ThemeContext = createContext(undefined)

// Custom hook to access the theme context
export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

// ThemeProvider component to manage and provide theme state
export const ThemeProvider = ({ children }) => {
	const [theme, setThemeState] = useState('light') // Default theme

	// Initialize theme on mount
	useEffect(() => {
		// Check if window and localStorage are available (client-side check)
		if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
			const savedTheme = localStorage.getItem('theme')
			setThemeState(savedTheme || 'light') // Set theme based on saved value or default to 'light'
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			setThemeState('dark')
		}
	}, []) // Empty dependency array means this effect runs once on mount

	// Apply theme changes to the document and localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', theme) // Save the current theme to localStorage
		}

		// Apply the theme to the document element (HTML tag)
		if (theme === 'dark') {
			document.documentElement.classList.add('dark') // Apply dark mode class to the document
		} else {
			document.documentElement.classList.remove('dark') // Remove dark mode class
		}
	}, [theme])

	const setTheme = (newTheme) => {
		setThemeState(newTheme) // Set the new theme
	}

	const toggleTheme = () => {
		setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')) // Toggle between light and dark theme
	}

	return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}
