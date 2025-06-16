import React from 'react'
import Link from 'next/link'
import { Database, Github, Twitter, Mail } from 'lucide-react'

function Footer() {
	return (
		<footer className="bg-gray-900 text-white py-12">
			<div className="max-w-7xl mx-auto px-4">
				{/* Footer Main Section */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					{/* Company Info Section */}
					<div>
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Database className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold">dbConnect</span>
						</div>
						<p className="text-gray-400">The easiest way to build and manage APIs with a visual interface for MongoDB databases.</p>
					</div>

					{/* Connect Section */}
					<div>
						<h4 className="font-semibold mb-4">Connect</h4>
						<div className="flex gap-6">
							<Link href="https://github.com/rhiaji" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors">
								<Github className="w-5 h-5" />
							</Link>
							<Link
								href="https://x.com/MrLucky_Guy"
								target="_blank"
								aria-label="Twitter"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Twitter className="w-5 h-5" />
							</Link>
						</div>
					</div>

					{/* Useful Links Section */}
					<div>
						<h4 className="font-semibold mb-4">Useful Links</h4>
						<div className="flex flex-col gap-2">
							<Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
								Privacy Policy
							</Link>
							<Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
								Terms of Service
							</Link>
						</div>
					</div>

					{/* Legal Info Section */}
					<div>
						<h4 className="font-semibold mb-4">Legal</h4>
						<div className="flex flex-col gap-2">
							<p className="text-gray-400 text-sm">© {new Date().getFullYear()} dbConnect. All rights reserved.</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
