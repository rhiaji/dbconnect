'use client'
import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Database, Shield, Save, Eye, EyeOff, Key, Plug, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from '@/context/ThemeContext'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/context/AuthContext' // Use AuthContext to manage authentication state
import { useApp } from '@/context/AppContext'
import ProtectedRoute from '@/hooks/ProtectedRoute'

const Settings = () => {
	const [activeTab, setActiveTab] = useState('profile')
	const [showOldPassword, setShowOldPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [showSecretKey, setShowSecretKey] = useState(false)
	const [settings, setSettings] = useState({
		username: '',
		email: '',
		db: 'dbconnect1',
		apiKey: '••••••••••••••••',
		secretKey: '••••••••••••••••••••••••••••••••',
	})
	const [initialSettings, setInitialSettings] = useState(settings) // Store initial settings
	const [passwordData, setPasswordData] = useState({
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	})

	const { theme, toggleTheme } = useTheme() // Use the theme from ThemeContext
	const { updateUser, changePassword, deleteUser } = useAuth() // Use AuthContext for authentication-related actions
	const { userState, username, email, db, apiKey, secretKey } = useApp()

	useEffect(() => {
		if (userState) {
			setSettings({
				username: username,
				email: email,
				db: db,
				apiKey: apiKey || '••••••••••••••••',
				secretKey: secretKey || '••••••••••••••••••••••••••••••••',
			})
			setInitialSettings({
				username: username,
				email: email,
				db: db,
				apiKey: apiKey || '••••••••••••••••',
				secretKey: secretKey || '••••••••••••••••••••••••••••••••',
			}) // Update initial settings with current values
		}
	}, [userState])

	// Handle save for user settings update
	const handleSave = async () => {
		if (JSON.stringify(settings) !== JSON.stringify(initialSettings)) {
			try {
				await updateUser(settings) // Update user settings
				setInitialSettings(settings) // Update initial settings after saving
			} catch (error) {
				toast.error('Error saving settings.')
			}
		} else {
			toast.info('No changes detected.')
		}
	}

	// Handle password change
	const handlePasswordChange = async () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error('New passwords do not match.')
			return
		}

		if (passwordData.newPassword.length < 8) {
			toast.error('New password must be at least 8 characters long.')
			return
		}

		try {
			await changePassword(passwordData.oldPassword, passwordData.newPassword)
			setPasswordData({
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
			})
		} catch (error) {
			toast.error('Error changing password.')
		}
	}

	// Handle delete user action
	const handleDeleteUser = async () => {
		const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
		if (confirmDelete) {
			try {
				await deleteUser() // Call deleteUser from context
			} catch (error) {
				toast.error('Error deleting account.')
			}
		}
	}

	// Generate new secret key for encryption
	const generateSecretKey = () => {
		const newSecretKey = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('')
		setSettings({ ...settings, secretKey: newSecretKey })
		toast('Secret key generated', {
			description: 'A new secret key has been generated for encryption.',
		})
	}

	// Tabs array for navigation
	const tabs = [
		{ id: 'profile', label: 'Profile', icon: User },
		{ id: 'database', label: 'Database', icon: Database },
		{ id: 'security', label: 'Security', icon: Shield },
	]

	// Check if there are any changes to the settings
	const isSaveDisabled = JSON.stringify(settings) === JSON.stringify(initialSettings)

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col font-sans">
				<Navigation />
				<main className="flex-1 flex flex-col bg-gray-50 dark:bg-background">
					<div className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
							<p className="text-gray-600 dark:text-gray-400">Manage your account and application preferences</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-1">
								<Card>
									<CardContent className="p-2">
										{tabs.map((tab) => {
											const Icon = tab.icon
											return (
												<button
													key={tab.id}
													onClick={() => setActiveTab(tab.id)}
													className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
														activeTab === tab.id
															? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
													}`}
												>
													<Icon className="w-5 h-5" />
													{tab.label}
												</button>
											)
										})}
									</CardContent>
								</Card>
							</div>

							<div className="lg:col-span-2">
								<Card>
									{/* Profile Tab */}
									{activeTab === 'profile' && (
										<>
											<CardHeader>
												<CardTitle>Profile Settings</CardTitle>
											</CardHeader>
											<CardContent className="space-y-6">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div>
														<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
															Username
														</label>
														<Input
															type="text"
															value={settings.username}
															onChange={(e) => setSettings({ ...settings, username: e.target.value })}
														/>
													</div>
													<div>
														<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
															Email Address
														</label>
														<Input
															type="email"
															value={settings.email}
															onChange={(e) => setSettings({ ...settings, email: e.target.value })}
														/>
													</div>
												</div>

												{/* Change Password */}
												<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
													<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Change Password</h3>
													<div className="space-y-4 max-w-md">
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																Current Password
															</label>
															<div className="relative">
																<Input
																	type={showOldPassword ? 'text' : 'password'}
																	value={passwordData.oldPassword}
																	onChange={(e) =>
																		setPasswordData({ ...passwordData, oldPassword: e.target.value })
																	}
																	className="pr-12"
																/>
																<button
																	type="button"
																	onClick={() => setShowOldPassword(!showOldPassword)}
																	className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
																>
																	{showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
																</button>
															</div>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																New Password
															</label>
															<div className="relative">
																<Input
																	type={showNewPassword ? 'text' : 'password'}
																	value={passwordData.newPassword}
																	onChange={(e) =>
																		setPasswordData({ ...passwordData, newPassword: e.target.value })
																	}
																	className="pr-12"
																/>
																<button
																	type="button"
																	onClick={() => setShowNewPassword(!showNewPassword)}
																	className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
																>
																	{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
																</button>
															</div>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																Confirm New Password
															</label>
															<div className="relative">
																<Input
																	type={showConfirmPassword ? 'text' : 'password'}
																	value={passwordData.confirmPassword}
																	onChange={(e) =>
																		setPasswordData({ ...passwordData, confirmPassword: e.target.value })
																	}
																	className="pr-12"
																/>
																<button
																	type="button"
																	onClick={() => setShowConfirmPassword(!showConfirmPassword)}
																	className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
																>
																	{showConfirmPassword ? (
																		<EyeOff className="w-4 h-4" />
																	) : (
																		<Eye className="w-4 h-4" />
																	)}
																</button>
															</div>
														</div>
														<Button onClick={handlePasswordChange} className="flex items-center gap-2">
															<Key className="w-4 h-4" />
															Change Password
														</Button>
													</div>
												</div>

												<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
													<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
													<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
														<div>
															<label className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme</label>
															<p className="text-sm text-gray-500 dark:text-gray-400">
																Toggle between light and dark mode
															</p>
														</div>
														<Switch
															checked={theme === 'dark'}
															onCheckedChange={toggleTheme} // Toggle the theme between light and dark
														/>
													</div>
												</div>
											</CardContent>
										</>
									)}

									{/* Save Changes Button */}
									{activeTab === 'profile' && (
										<div className="border-t border-gray-200 dark:border-gray-700 p-6">
											<Button
												onClick={handleSave}
												className="flex items-center gap-2"
												disabled={isSaveDisabled} // Disable save button if no changes
											>
												<Save className="w-4 h-4" />
												Save Changes
											</Button>
										</div>
									)}

									{/* Database Tab */}
									{activeTab === 'database' && (
										<>
											<CardHeader>
												<CardTitle>Database Settings</CardTitle>
											</CardHeader>
											<CardContent className="space-y-6">
												<div className="flex items-end gap-3">
													<div className="flex-1">
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
																Connected Database
															</label>
															<div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
																<Database className="w-5 h-5 text-gray-500 dark:text-gray-400" />
																<span className="font-medium text-gray-900 dark:text-gray-100">{settings.db}</span>
															</div>
														</div>

														<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
															Active Database
														</label>
														<Select
															value={settings.db}
															onValueChange={(value) => setSettings({ ...settings, db: value })}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select a database" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="dbconnect1">dbconnect1</SelectItem>
																<SelectItem value="dbconnect2">dbconnect2</SelectItem>
															</SelectContent>
														</Select>
													</div>
													<Button
														onClick={handleSave}
														className="flex items-center gap-2"
														disabled={isSaveDisabled} // Disable save button if no changes
													>
														<Plug className="mr-2" />
														Connect
													</Button>
												</div>
											</CardContent>
										</>
									)}

									{/* Security Tab */}
									{activeTab === 'security' && (
										<>
											<CardHeader>
												<CardTitle>Security Settings</CardTitle>
											</CardHeader>
											<CardContent className="space-y-6">
												{/* API Key */}
												<div>
													<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
													<div className="flex gap-3">
														<Input type="password" value={settings.apiKey} className="flex-1 max-w-md" readOnly />
														<Button variant="outline">
															<Database className="w-4 h-4 mr-2" />
															Regenerate
														</Button>
													</div>
												</div>

												{/* Secret Key */}
												<div>
													<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
														Secret Key for Encryption
													</label>
													<div className="flex gap-3">
														<div className="relative flex-1 max-w-md">
															<Input
																type={showSecretKey ? 'text' : 'password'}
																value={settings.secretKey}
																onChange={(e) => setSettings({ ...settings, secretKey: e.target.value })}
																className="pr-12 font-mono text-sm"
																placeholder="Enter your secret key for request encryption"
															/>
															<button
																type="button"
																onClick={() => setShowSecretKey(!showSecretKey)}
																className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
															>
																{showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
															</button>
														</div>
														<Button onClick={generateSecretKey} className="bg-green-600 hover:bg-green-700">
															<Database className="w-4 h-4 mr-2" />
															Generate
														</Button>
													</div>
													<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
														This key will be used to encrypt your requests when the "Encrypt Request" option is enabled
													</p>
												</div>

												{/* Danger Zone */}
												<div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
													<h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
													<Button variant="destructive" onClick={handleDeleteUser}>
														<Trash2 className="w-4 h-4 mr-2" />
														Delete Account
													</Button>
												</div>
											</CardContent>
										</>
									)}

									{/* Save Changes Button */}
									{activeTab === 'security' && (
										<div className="border-t border-gray-200 dark:border-gray-700 p-6">
											<Button onClick={handleSave} className="flex items-center gap-2" disabled={isSaveDisabled}>
												<Save className="w-4 h-4" />
												Save Changes
											</Button>
										</div>
									)}
								</Card>
							</div>
						</div>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	)
}

export default Settings
