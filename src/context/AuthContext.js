'use client'
import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { SERVER_URL, JWT_SECRET } from '@/config/config'
import { encryptPayload } from '@/utils/encryptPayload'
import { useRouter } from 'next/navigation'

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

		// If response contains a token, set cookie and return response data
		if (response?.data?.token) {
			Cookies.set('auth_token', response.data.token, { expires: 3 })
			return response // Return the response for further processing
		}

		// Handle other success cases
		toast.success(response.data.message || 'Success')
		return response // Return the response for further processing
	} catch (error) {
		toast.error(`Error: ${error.response?.data?.message || 'Something went wrong.'}`)
		console.error('Error during API request:', error)
	}
}

export const AuthProvider = ({ children }) => {
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	// Log in handler function
	const logInHandler = async (username, password) => {
		setLoading(true)

		try {
			// Encrypt the payload
			const payload = await encryptPayload({ username, password }, JWT_SECRET)

			// Send the login request
			const response = await handleRequest('POST', `${SERVER_URL}/api/user/login`, { request: payload })

			if (response?.data?.token) {
				// If successful, set the token and redirect to dashboard
				Cookies.set('auth_token', response.data.token, { expires: 3 }) // Set token in cookies
				router.push('/dashboard') // Redirect to dashboard
			} else {
				toast.error('Invalid credentials, please try again.') // If login fails, show error message
			}
		} catch (error) {
			toast.error(`Login failed: ${error?.message || 'Something went wrong'}`)
		}

		setLoading(false) // Stop loading regardless of success or failure
	}

	// Sign up handler function
	const signUpHandler = async (username, email, password) => {
		setLoading(true)

		try {
			// Encrypt the payload
			const payload = await encryptPayload({ username, email, password }, JWT_SECRET)

			// Send the sign-up request
			const response = await handleRequest('POST', `${SERVER_URL}/api/user/signup`, { request: payload })

			// If sign-up is successful, proceed to log in
			if (response?.data?.message === 'User created successfully') {
				toast.success('User created successfully, logging in...')

				// Automatically log the user in
				await logInHandler(username, password) // Call the login handler here
			} else {
				toast.error('Failed to create user. Please try again.')
			}
		} catch (error) {
			toast.error(`Sign-up failed: ${error?.message || 'Something went wrong'}`)
		}

		setLoading(false) // Stop loading regardless of success or failure
	}

	return <AuthContext.Provider value={{ logInHandler, signUpHandler, loading }}>{children}</AuthContext.Provider>
}
