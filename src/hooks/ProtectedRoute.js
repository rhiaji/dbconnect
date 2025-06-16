'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useApp } from '@/context/AppContext'
import LoadingPage from '@/components/LoadingPage'

function ProtectedRoute({ children }) {
	const router = useRouter()
	const { loading } = useApp()

	useEffect(() => {
		const auth = Cookies.get('auth_token')
		// If not loading and no auth token or user, redirect
		if (!auth) {
			router.replace('/')
		}
	}, [loading, router])

	// Show loading page while fetching user data
	if (loading) {
		return <LoadingPage />
	}

	return <>{children}</>
}

export default ProtectedRoute
