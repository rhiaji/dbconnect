'use client'
import React, { useState } from 'react'
import LoginModal from '@/components/LoginModal'
import SignupModal from '@/components/SignupModal'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Database, Shield, Zap, Code, Github, Twitter, Mail } from 'lucide-react'
import Footer from '@/components/Footer'
import Cookies from 'js-cookie'

const Index = () => {
	const [showLogin, setShowLogin] = useState(false)
	const [showSignup, setShowSignup] = useState(false)
	const router = useRouter()

	const auth = Cookies.get('auth_token')

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
						<div className="flex items-center gap-3">
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
							<div className="flex gap-3">
								<button
									className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
									onClick={() => {
										if (auth) {
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
							Build MongoDB APIs
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Effortlessly</span>
						</h1>
						<p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
							Create, test, and manage MongoDB-powered APIs with our intuitive visual interface. No complex setup required.
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

				{/* Features Section */}
				<section id="features" className="py-20 bg-white">
					<div className="max-w-6xl mx-auto px-4">
						<h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Everything you need to build APIs</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							<div className="text-center group">
								<div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
									<Database className="w-8 h-8 text-blue-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">MongoDB Collections</h3>
								<p className="text-gray-600">Create and manage collections with an intuitive interface</p>
							</div>
							<div className="text-center group">
								<div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
									<Code className="w-8 h-8 text-green-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">HTTP Methods</h3>
								<p className="text-gray-600">Support for GET, POST, PUT, DELETE operations</p>
							</div>
							<div className="text-center group">
								<div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
									<Shield className="w-8 h-8 text-purple-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">JWT & Encryption</h3>
								<p className="text-gray-600">Built-in authentication and request encryption</p>
							</div>
							<div className="text-center group">
								<div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
									<Zap className="w-8 h-8 text-orange-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Testing</h3>
								<p className="text-gray-600">Test your APIs instantly with formatted responses</p>
							</div>
						</div>
					</div>
				</section>
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
