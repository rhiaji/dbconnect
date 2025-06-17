'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, Code, Database, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { codeExamples } from '@/utils/docs'
import Footer from '@/components/Footer'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useRouter } from 'next/navigation'

const Docs = () => {
	const router = useRouter()
	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(() => {
			toast('Copied to clipboard!')
		})
	}

	const sampleResponse = {
		success: true,
		message: "Successfully fetched data from collection 'products'",
		data: {
			database: 'dbconnect1',
			collection: 'products',
			method: 'GET',
			data: {
				data: [
					{
						_id: '6850e7547bbed737c4725fa0',
						name: 'shirt',
						price: 1,
						createdAt: '2025-06-17T03:56:04.715Z',
						updatedAt: '2025-06-17T03:56:04.715Z',
					},
				],
				pagination: {
					page: 1,
					limit: 100,
					total: 3,
					hasMore: false,
				},
			},
			meta: {
				timestamp: '2025-06-17T10:15:47.277Z',
				version: '1.0.0',
				apiVersion: 'v1',
			},
		},
	}

	const sampleErrorResponse = {
		success: false,
		message: "Field 'price' should be of type 'Number'",
		data: {
			database: 'dbconnect1',
			collection: 'products',
			method: 'POST',
			data: {},
			meta: {
				timestamp: '2025-06-17T10:11:34.291Z',
				version: '1.0.0',
				apiVersion: 'v1',
			},
		},
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col font-sans">
			<header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center ">
								<Database className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900">dbConnect</span>
						</div>
						<nav className="hidden md:flex items-center gap-8">
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

			<main className="flex-1">
				<div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
					{/* Quick Start */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Quick Start Guide</h2>
						<div className="grid md:grid-cols-3 gap-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
											1
										</div>
										Authentication
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400 mb-4">
										Get your API key from the Settings and include it in your requests.
									</p>
									<div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md font-mono text-sm">x-auth-token: your-api-key</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
											2
										</div>
										Choose Collection
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400 mb-4">Select the MongoDB collection you want to interact with.</p>
									<div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md font-mono text-sm">/api/app/products?db=your_db</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
											3
										</div>
										Make Request
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400 mb-4">Use standard HTTP methods to perform operations.</p>
									<div className="flex gap-2">
										<Badge>GET</Badge>
										<Badge>POST</Badge>
										<Badge>PUT</Badge>
										<Badge>DELETE</Badge>
									</div>
								</CardContent>
							</Card>
						</div>
					</section>

					{/* Query Parameters Explanation */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Query Parameters Overview</h2>
						<Card>
							<CardHeader>
								<CardTitle>Query Parameters</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 dark:text-gray-400 mb-4">
									Here are the key query parameters you can use to customize your API requests:
								</p>

								<div className="space-y-4">
									{/* Page Parameter */}
									<div>
										<h4 className="font-semibold text-gray-700 dark:text-gray-300">Page</h4>
										<p className="text-gray-600 dark:text-gray-400">
											The <code>page</code> parameter is used for pagination. It specifies which page of results to retrieve
											when there are multiple pages of data available. By default, it starts at page 1.
										</p>
										<div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm">
											Example: <code>?page=2</code>
										</div>
									</div>

									{/* ID Parameter */}
									<div>
										<h4 className="font-semibold text-gray-700 dark:text-gray-300">ID</h4>
										<p className="text-gray-600 dark:text-gray-400">
											The <code>id</code> parameter is used to fetch a specific document by its unique identifier. It is
											required for operations like <strong>GET</strong> and <strong>DELETE</strong> when specifying a document
											to retrieve or delete.
										</p>
										<div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm">
											Example: <code>?id=507f1f77bcf86cd799439011</code>
										</div>
									</div>

									{/* DB Parameter */}
									<div>
										<h4 className="font-semibold text-gray-700 dark:text-gray-300">DB</h4>
										<p className="text-gray-600 dark:text-gray-400">
											The <code>db</code> parameter specifies which database to interact with. For instance, if you're using the
											public databases, the <code>db</code> value might be <code>dbconnect1</code> or <code>dbconnect2</code>.
										</p>
										<div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm">
											Example: <code>?db=dbconnect1</code>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* API Reference */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">API Reference</h2>

						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Badge variant="secondary">GET</Badge>
										Retrieve Documents
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400 mb-4">
										Fetch all documents from a collection or filter with query parameters. For now 100 documents per fetch.
									</p>
									<div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm">
										GET /api/app/{`{collection}`}?db={`{db}`}&id={`{id}`}&page={`{page}`}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											POST
										</Badge>
										Create Document
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400 mb-4">Create a new document in the specified collection.</p>
									<div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm">
										POST /api/app/{`{collection}`}?db={`{db}`}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
											PUT
										</Badge>
										Update Document
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400 mb-4">Update an existing document by its ID.</p>
									<div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm">
										PUT /api/app/{`{collection}`}?db={`{db}`}&id={`{id}`}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											DELETE
										</Badge>
										Delete Document
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400 mb-4">Delete a document by its ID.</p>
									<div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm">
										DELETE /api/app/{`{collection}`}?db={`{db}`}&id={`{id}`}
									</div>
								</CardContent>
							</Card>
						</div>
					</section>

					{/* Code Examples */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Code Examples</h2>

						<Card>
							<CardContent className="p-6">
								{/* Tabs for HTTP Methods (GET, POST, PUT, DELETE) */}
								<Tabs defaultValue="GET" className="w-full">
									<TabsList className="grid w-full grid-cols-4">
										<TabsTrigger value="GET">GET</TabsTrigger>
										<TabsTrigger value="POST">POST</TabsTrigger>
										<TabsTrigger value="PUT">PUT</TabsTrigger>
										<TabsTrigger value="DELETE">DELETE</TabsTrigger>
									</TabsList>

									{/* Tabs for Languages (JavaScript, Python) */}
									<TabsContent value="GET">
										<Tabs defaultValue="javascript" className="w-full mt-4">
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="javascript">JavaScript</TabsTrigger>
												<TabsTrigger value="python">Python</TabsTrigger>
											</TabsList>

											<TabsContent value="javascript">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.GET.javascript}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.GET.javascript)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="python">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.GET.python}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.GET.python)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>
										</Tabs>
									</TabsContent>

									<TabsContent value="POST">
										<Tabs defaultValue="javascript" className="w-full mt-4">
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="javascript">JavaScript</TabsTrigger>
												<TabsTrigger value="python">Python</TabsTrigger>
											</TabsList>

											<TabsContent value="javascript">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.POST.javascript}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.POST.javascript)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="python">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.POST.python}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.POST.python)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>
										</Tabs>
									</TabsContent>

									<TabsContent value="PUT">
										<Tabs defaultValue="javascript" className="w-full mt-4">
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="javascript">JavaScript</TabsTrigger>
												<TabsTrigger value="python">Python</TabsTrigger>
											</TabsList>

											<TabsContent value="javascript">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.PUT.javascript}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.PUT.javascript)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="python">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.PUT.python}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.PUT.python)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>
										</Tabs>
									</TabsContent>

									<TabsContent value="DELETE">
										<Tabs defaultValue="javascript" className="w-full mt-4">
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="javascript">JavaScript</TabsTrigger>
												<TabsTrigger value="python">Python</TabsTrigger>
											</TabsList>

											<TabsContent value="javascript">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.DELETE.javascript}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.DELETE.javascript)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>

											<TabsContent value="python">
												<div className="relative">
													<pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm">
														<code>{codeExamples.DELETE.python}</code>
													</pre>
													<Button
														size="sm"
														variant="ghost"
														className="absolute top-2 right-2 text-gray-400 hover:text-white"
														onClick={() => copyToClipboard(codeExamples.DELETE.python)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</TabsContent>
										</Tabs>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</section>
					{/* Response Examples */}
					<section className="mb-16">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Response Examples</h2>

						<div className="grid md:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Success Response</CardTitle>
								</CardHeader>
								<CardContent>
									<SyntaxHighlighter
										language="json"
										style={atomDark}
										customStyle={{
											margin: 0,
											borderRadius: '0.375rem',
											maxHeight: 'auto',
											background: '#111827',
										}}
										codeTagProps={{
											style: {
												fontFamily: '"Fira Code", "Dank Mono", monospace',
												fontSize: '0.875rem',
											},
										}}
									>
										{JSON.stringify(sampleResponse, null, 2)} {/* Use JSON.stringify here */}
									</SyntaxHighlighter>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Error Response</CardTitle>
								</CardHeader>
								<CardContent>
									<SyntaxHighlighter
										language="json"
										style={atomDark}
										customStyle={{
											margin: 0,
											borderRadius: '0.375rem',
											maxHeight: 'auto',
											background: '#111827',
										}}
										codeTagProps={{
											style: {
												fontFamily: '"Fira Code", "Dank Mono", monospace',
												fontSize: '0.875rem',
											},
										}}
									>
										{JSON.stringify(sampleErrorResponse, null, 2)} {/* Use JSON.stringify here */}
									</SyntaxHighlighter>
								</CardContent>
							</Card>
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default Docs
