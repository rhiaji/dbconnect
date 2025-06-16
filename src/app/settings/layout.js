import React from 'react'
import ProtectedRoute from '@/hooks/ProtectedRoute'
import { AppProvider } from '@/context/AppContext'

function SettingsLayout({ children }) {
	return (
		<AppProvider>
			<ProtectedRoute>{children}</ProtectedRoute>
		</AppProvider>
	)
}

export default SettingsLayout
