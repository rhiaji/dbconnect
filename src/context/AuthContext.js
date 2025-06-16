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

const authToken = Cookies.get('auth_token')

// Helper function to handle API requests and show toast notifications
const handleRequest = async (method, url, data) => {
	try {
		const response = await axios({
			method,
			url,
			headers: { 'x-auth-token': authToken },
			data,
		})

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
			const response = await handleRequest('POST', `${SERVER_URL}/api/user/login`, { data: payload })

			if (response?.data?.data.token) {
				// If successful, set the token and redirect to dashboard
				Cookies.set('auth_token', response.data.data.token, { expires: 3 }) // Set token in cookies
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
			const response = await handleRequest('POST', `${SERVER_URL}/api/user/signup`, { data: payload })

			// If sign-up is successful, proceed to log in

			if (response?.data?.success) {
				// Automatically log the user in
				await logInHandler(username, password) // Call the login handler here
			}
		} catch (error) {
			toast.error(`Sign-up failed: ${error?.message || 'Something went wrong'}`)
		}

		setLoading(false) // Stop loading regardless of success or failure
	}

	// Update user settings (username, email, db, apiKey, secretKey)
	const updateUser = async (settings) => {
		setLoading(true)
		try {
			await handleRequest('PUT', `${SERVER_URL}/api/user/update`, { data: settings })
		} catch (error) {
			toast.error('Error updating user settings.')
		} finally {
			setLoading(false)
		}
	}

	// Change password
	const changePassword = async (oldPassword, newPassword) => {
		setLoading(true)
		try {
			await handleRequest('PUT', `${SERVER_URL}/api/user/change-password`, { data: { oldPassword, newPassword } })
		} catch (error) {
			toast.error('Error changing password.')
		} finally {
			setLoading(false)
		}
	}

	// Delete user
	const deleteUser = async () => {
		setLoading(true)
		try {
			// Make the delete request to the server
			const response = await handleRequest('DELETE', `${SERVER_URL}/api/user/delete`, {})

			// If the request is successful, clear the user's authentication data
			if (response.data.success) {
				Cookies.remove('auth_token') // Clear the authentication cookie
				localStorage.clear() // Clear local storage data
				router.push('/') // Redirect the user to the homepage or login page
			}
		} catch (error) {
			toast.error('Error deleting user account.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthContext.Provider value={{ logInHandler, signUpHandler, updateUser, changePassword, deleteUser, loading }}>
			{children}
		</AuthContext.Provider>
	)
}
