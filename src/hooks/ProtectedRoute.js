'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

function ProtectedRoute({ children }) {
	const router = useRouter()

	useEffect(() => {
		const auth = Cookies.get('auth_token')
		// If not loading and no auth token or user, redirect
		if (!auth) {
			router.replace('/')
		}
	}, [router])

	return <>{children}</>
}

export default ProtectedRoute
