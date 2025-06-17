'use client'
import React, { useState } from 'react'
import LoginModal from '@/components/LoginModal'
import SignupModal from '@/components/SignupModal'
import { useRouter } from 'next/navigation'
import { Database, Shield, Zap, Code, Search, FileText } from 'lucide-react'
import Footer from '@/components/Footer'
import Cookies from 'js-cookie'

const Index = () => {
	const [showLogin, setShowLogin] = useState(false)
	const [showSignup, setShowSignup] = useState(false)
	const router = useRouter()

	const authToken = Cookies.get('auth_token')

	const handleScrollToSection = (sectionId) => {
		const section = document.getElementById(sectionId)
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' })
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col font-sans">
			{/* Header */}
			<header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Database className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900">dbConnect</span>
						</div>
						<nav className="hidden md:flex items-center gap-8">
							<button onClick={() => handleScrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors">
								Features
							</button>
							<button onClick={() => handleScrollToSection('about')} className="text-gray-600 hover:text-gray-900 transition-colors">
								About
							</button>
							<button className="text-gray-600 hover:text-gray-900 transition-colors" onClick={() => router.push('/docs')}>
								Documentation
							</button>
							<div className="flex gap-3">
								<button
									className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
									onClick={() => {
										if (authToken) {
											router.push('/dashboard')
										} else {
											setShowLogin(true)
										}
									}}
								>
									Log In
								</button>
								<button
									className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
									onClick={() => setShowSignup(true)}
								>
									Sign Up
								</button>
							</div>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<main className="flex-1">
				<section className="py-20 px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 mb-6 animate-fade-in">
							Manage MongoDB Databases
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Effortlessly</span>
						</h1>
						<p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
							Easily create and manage MongoDB databases and collections. APIs are auto-generated for seamless data interaction.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
							<button
								className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
								onClick={() => setShowSignup(true)}
							>
								Get Started Free
							</button>
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section id="how-it-works" className="py-20 bg-gray-50">
					<div className="max-w-6xl mx-auto text-center">
						<h2 className="text-4xl font-bold text-gray-900 mb-8">How It Works</h2>
						<p className="text-xl sm:text-2xl text-gray-600 mb-8">
							With dbConnect, connecting to MongoDB and interacting with your data has never been easier. Here's how you can get
							started:
						</p>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
							<div className="text-center">
								<div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
									<Search className="w-8 h-8 text-blue-600" />
								</div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Connect to Your MongoDB</h3>
								<p className="text-gray-600">
									Select a MongoDB database to connect to. The app supports automatic connection setup with just a few clicks.
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
									<FileText className="w-8 h-8 text-green-600" />
								</div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Explore Collections</h3>
								<p className="text-gray-600">
									Browse and explore all available collections within your selected database. Each collection is fully interactive.
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
									<Shield className="w-8 h-8 text-purple-600" />
								</div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">3. View and Interact with Schemas</h3>
								<p className="text-gray-600">
									Check out the schema structure of each collection to understand how the data is organized and how to make API
									calls.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Benefits Section */}
				<section id="benefits" className="py-20 bg-white">
					<div className="max-w-6xl mx-auto text-center">
						<h2 className="text-4xl font-bold text-gray-900 mb-16">Why Choose dbConnect?</h2>
						<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							<div className="text-center">
								<div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
									<Zap className="w-8 h-8 text-blue-600" />
								</div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">No Complex Setup</h3>
								<p className="text-gray-600">
									dbConnect makes it easy to connect to your MongoDB without complicated setup procedures. Just select your database
									and start exploring.
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
									<Code className="w-8 h-8 text-green-600" />
								</div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time API Testing</h3>
								<p className="text-gray-600">
									Test your API calls in real-time with easy-to-use, interactive features. Validate your queries and responses
									instantly.
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
									<Shield className="w-8 h-8 text-purple-600" />
								</div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
								<p className="text-gray-600">
									We prioritize security. Your data is protected with encrypted API endpoints and built-in authentication
									mechanisms.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* API Documentation Section
				<section id="api-documentation" className="py-20 bg-gray-50">
					<div className="max-w-6xl mx-auto text-center">
						<h2 className="text-4xl font-bold text-gray-900 mb-8">API Documentation</h2>
						<p className="text-xl sm:text-2xl text-gray-600 mb-8">
							Easily interact with your MongoDB database through our intuitive API. Here’s a quick overview of the available endpoints:
						</p>
						<div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
							<div className="bg-white p-6 rounded-lg shadow-md">
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">GET: /api/collections</h3>
								<p className="text-gray-600">
									Fetch all the collections in the selected database. Use this endpoint to get a list of available collections.
								</p>
							</div>
							<div className="bg-white p-6 rounded-lg shadow-md">
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">POST: /api/insert</h3>
								<p className="text-gray-600">
									Insert a new document into the specified collection. Provide the collection name and document data in the request
									body.
								</p>
							</div>
							<div className="bg-white p-6 rounded-lg shadow-md">
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">PUT: /api/update</h3>
								<p className="text-gray-600">
									Update an existing document in the specified collection by providing the document ID and updated data.
								</p>
							</div>
							<div className="bg-white p-6 rounded-lg shadow-md">
								<h3 className="text-2xl font-semibold text-gray-900 mb-4">DELETE: /api/delete</h3>
								<p className="text-gray-600">
									Delete a document from a collection by providing the document ID. Make sure to check the document before deletion.
								</p>
							</div>
						</div>
						<div className="mt-8">
							<a href="/api-docs" className="text-blue-600 hover:text-blue-700 font-medium text-lg">
								View Full API Documentation
							</a>
						</div>
					</div>
				</section> */}
			</main>

			{/* Footer Section */}
			<Footer />

			{/* Modals */}
			<LoginModal
				isOpen={showLogin}
				onClose={() => setShowLogin(false)}
				onSignup={() => {
					setShowLogin(false)
					setShowSignup(true)
				}}
			/>
			<SignupModal
				isOpen={showSignup}
				onClose={() => setShowSignup(false)}
				onLogin={() => {
					setShowSignup(false)
					setShowLogin(true)
				}}
			/>
		</div>
	)
}

export default Index
