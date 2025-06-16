'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useApp } from '@/context/AppContext'
import LoadingPage from '@/components/LoadingPage'

function ProtectedRoute({ children }) {
	const router = useRouter()
	const { loading, userState } = useApp()

	useEffect(() => {
		const auth = Cookies.get('auth_token')
		// If not loading and no auth token or user, redirect
		if (!loading && (!auth || !userState)) {
			router.replace('/')
		}
	}, [loading, userState, router])

	// Show loading page while fetching user data
	if (loading) {
		return <LoadingPage />
	}

	// Only render children if user is authenticated
	if (!userState) {
		return null
	}

	return <>{children}</>
}

export default ProtectedRoute
