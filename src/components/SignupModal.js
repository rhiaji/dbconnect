'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'

const SignupModal = ({ isOpen, onClose, onLogin }) => {
	const { signUpHandler } = useAuth()

	// Form state
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
	})

	const resetFormData = () => {
		setFormData({
			email: '',
			username: '',
			password: '',
		})
	}

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('') // Error state for password validation

	if (!isOpen) return null

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		// Password validation: must be at least 8 characters long
		if (formData.password.length < 8) {
			setError('Password must be at least 8 characters long.')
			setLoading(false)
			return
		}

		try {
			// Call the signUpHandler to handle the signup logic
			await signUpHandler(formData.username, formData.email, formData.password)
			resetFormData()
			setError('') // Clear any previous errors
		} catch (error) {
			console.error('Signup failed:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Sign Up</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						{/* Username Field */}
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
						<Input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							required
							placeholder="Enter your username"
						/>

						{/* Email Field */}
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
						<Input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							required
							placeholder="Enter your email"
						/>

						{/* Password Field */}
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
						<Input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							required
							placeholder="Create a password"
						/>
						{/* Display password length error if any */}
						{error && <p className="text-red-600 text-sm">{error}</p>}

						{/* Sign Up Button */}
						<Button
							type="submit"
							className="w-full mt-4 rounded-lg bg-green-600 text-lg font-semibold text-white py-2 shadow hover:bg-green-700 transition-colors"
							disabled={loading}
						>
							{loading ? 'Creating account...' : 'Sign Up'}
						</Button>
					</form>

					<p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4">
						Already have an account?{' '}
						<button className="text-blue-600 hover:underline font-medium" onClick={onLogin} disabled={loading} type="button">
							Login
						</button>
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default SignupModal
