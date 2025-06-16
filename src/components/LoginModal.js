'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/context/AuthContext'
import { FlagTriangleLeft } from 'lucide-react'

const LoginModal = ({ isOpen, onClose, onSignup }) => {
	const { logInHandler } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({ username: '', password: '' })

	if (!isOpen) return null

	// Handle form input change
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prevData) => ({ ...prevData, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			// Call the logInHandler with formData values
			await logInHandler(formData.username, formData.password)
		} catch (error) {
			console.error('Login failed:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Login</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
						<Input
							type="text"
							name="username" // Bind name to form data
							value={formData.username} // Controlled input
							onChange={handleInputChange} // Handle input change
							required
							disabled={loading}
							placeholder="Enter your username"
						/>

						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
						<Input
							type="password"
							name="password" // Bind name to form data
							value={formData.password} // Controlled input
							onChange={handleInputChange} // Handle input change
							required
							disabled={loading}
							placeholder="Enter your password"
						/>

						<Button
							type="submit"
							className="w-full mt-4 rounded-lg bg-blue-600 text-lg font-semibold text-white py-2 shadow hover:bg-blue-700 transition-colors"
							disabled={loading}
						>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</form>

					<p className="text-gray-500 text-sm text-center mt-4">
						No account?{' '}
						<button className="text-blue-600 hover:underline font-medium" onClick={onSignup} disabled={loading} type="button">
							Sign Up
						</button>
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default LoginModal
