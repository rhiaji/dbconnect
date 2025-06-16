'use client'
import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { SERVER_URL, JWT_SECRET } from '@/config/config'
import { encryptPayload } from '@/utils/encryptPayload'

// Create a context for authentication management
const AuthContext = createContext(undefined)

// Custom hook to access the authentication context
export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

// Helper function to handle API requests and show toast notifications
const handleRequest = async (method, url, data) => {
	try {
		const response = await axios({
			method,
			url,
			headers: { 'Content-Type': 'application/json' },
			data,
		})

		// Check if a token is returned and store it in cookies
		if (response.data.token) {
			Cookies.set('auth_token', response.data.token, { expires: 3 }) // Set cookie with token and expiry of 1 day
		}

		if (response.status === 200) {
			toast.success(response.data.message || 'Success') // Success toast
		} else {
			toast.error('Something went wrong. Please try again.') // Error toast
		}
	} catch (error) {
		toast.error(`Error: ${error.response?.data?.message || 'Something went wrong.'}`) // Error toast
		console.error('Error during API request:', error)
	}
}

export const AuthProvider = ({ children }) => {
	const [loading, setLoading] = useState(false)

	// Log in handler function
	const logInHandler = async (username, password) => {
		setLoading(true)
		const payload = await encryptPayload({ username, password }, JWT_SECRET)
		await handleRequest('POST', `${SERVER_URL}/api/user/login`, { request: payload })
		setLoading(false)
	}

	// Sign up handler function
	const signUpHandler = async (username, email, password) => {
		setLoading(true)
		const payload = await encryptPayload({ username, email, password }, JWT_SECRET)
		await handleRequest('POST', `${SERVER_URL}/api/user/signup`, { request: payload })
		setLoading(false)
	}

	return <AuthContext.Provider value={{ logInHandler, signUpHandler, loading }}>{children}</AuthContext.Provider>
}
