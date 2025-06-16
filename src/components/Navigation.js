import { LogOut, Home, Settings, Database } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const Navigation = ({ onSidebarToggle }) => {
	const router = useRouter()

	const handleLogout = () => {
		localStorage.clear()
		Cookies.remove('auth_token')
		router.push('/')
	}

	return (
		<nav className="h-16 bg-white dark:bg-gray-950 shadow-sm flex items-center px-4 sm:px-8 justify-between z-20 border-b border-gray-100 dark:border-gray-800 font-sans">
			<div className="flex items-center gap-4">
				{onSidebarToggle && (
					<button
						className="sm:hidden text-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-100 hover:dark:bg-gray-800 p-2"
						onClick={onSidebarToggle}
						aria-label="Toggle sidebar"
						type="button"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				)}
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
						<Database className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold text-gray-900 dark:text-gray-100">dbConnect</span>
				</div>
			</div>
			<div className="flex items-center gap-4 sm:gap-6">
				<button
					className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 hover:dark:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-200"
					onClick={() => router.push('/dashboard')}
				>
					<Home size={18} />
					<span className="hidden sm:inline">Dashboard</span>
				</button>
				<button
					className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 hover:dark:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-200"
					onClick={() => router.push('/settings')}
				>
					<Settings size={18} />
					<span className="hidden sm:inline">Settings</span>
				</button>
				<button
					className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 hover:dark:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-200"
					onClick={handleLogout}
				>
					<LogOut size={18} />
					<span className="hidden sm:inline">Logout</span>
				</button>
			</div>
		</nav>
	)
}

export default Navigation
