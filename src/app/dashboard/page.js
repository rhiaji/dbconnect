'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send, Lock, Database, ChevronDown, Plus, Trash2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import CreateCollectionModal from '@/components/dashboard/CreateCollectionModal'
import RequestConfirmationDialog from '@/components/dashboard/RequestConfirmationDialog'
import { encryptedData } from '@/utils/encryptPayload'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { SERVER_URL } from '@/config/config'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import ProtectedRoute from '@/hooks/ProtectedRoute'

const AppDashboard = () => {
	const { userCollections = [], db, response } = useApp()
	const router = useRouter()
	const [selectedCollection, setSelectedCollection] = useState('')
	const [method, setMethod] = useState('GET')
	const [jsonBody, setJsonBody] = useState('{\n  \n}')
	const [encrypt, setEncrypt] = useState(false)
	const [useHeaders, setUseHeaders] = useState(false)
	const [showSchema, setShowSchema] = useState(false)
	const [collectionSchema, setCollectionSchema] = useState({})
	const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json', enabled: true }])
	const [encryptedRequest, setEncryptedRequest] = useState()
	const [customApiUrl, setCustomApiUrl] = useState('')
	const [useCustomUrl, setUseCustomUrl] = useState(false)
	const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false)
	const [showRequestConfirmation, setShowRequestConfirmation] = useState(false)
	const [objectId, setObjectId] = useState('') // State to store the objectId

	useEffect(() => {
		if (userCollections.length > 0) {
			setSelectedCollection(userCollections[0]?.name)
		}
	}, [userCollections])

	// Function to transform the schema object to a Mongoose-like format string
	const transformToMongooseString = (schema) => {
		let schemaString = ''

		for (const key in schema) {
			if (schema.hasOwnProperty(key)) {
				const field = schema[key]
				let fieldString = `${key}: { type: ${field.type}`

				// Include 'unique' only if it's true
				if (field.unique === true) {
					fieldString += `, unique: true`
				}

				fieldString += ` }`

				schemaString += `${fieldString},\n` // Append to the final schema string
			}
		}

		return schemaString
	}

	// This effect runs whenever the selectedCollection changes
	useEffect(() => {
		const selectedCollectionData = userCollections.find((collection) => collection.name === selectedCollection)

		if (selectedCollectionData && selectedCollectionData.schema) {
			const mongooseString = transformToMongooseString(selectedCollectionData.schema)
			setCollectionSchema(mongooseString)
		}
	}, [selectedCollection, userCollections]) // Runs when selectedCollection changes

	const handleSendRequest = () => {
		setShowRequestConfirmation(true)
	}

	const getApiUrl = () => {
		// Start with the base URL
		let url = `${SERVER_URL}/api/app/${selectedCollection}?db=${db}`

		// Only add the objectId for GET or DELETE methods
		if ((method === 'GET' || method === 'DELETE') && objectId) {
			url += `&id=${objectId}`
		}

		// For other methods (POST/PUT), do not append objectId
		if (useCustomUrl) {
			return customApiUrl
		}

		return url
	}

	const updateHeader = (index, field, value) => {
		const newHeaders = [...headers]
		newHeaders[index] = { ...newHeaders[index], [field]: value }
		setHeaders(newHeaders)
	}

	const addHeader = () => {
		setHeaders([...headers, { key: '', value: '', enabled: false }])
	}

	const removeHeader = (index) => {
		setHeaders(headers.filter((_, i) => i !== index))
	}

	const getRequestData = () => {
		if (method === 'POST' || method === 'PUT') {
			try {
				return JSON.parse(jsonBody)
			} catch {
				return jsonBody
			}
		}
		return undefined
	}

	const methods = ['GET', 'POST', 'PUT', 'DELETE']

	const colors = {
		GET: 'bg-blue-100 text-blue-800',
		POST: 'bg-green-100 text-green-800',
		PUT: 'bg-yellow-100 text-yellow-800',
		DELETE: 'bg-red-100 text-red-800',
	}

	const handleJsonFormat = (value) => {
		const parsed = JSON.parse(value)
		const formatedJson = JSON.stringify(parsed, null, 2)
		setJsonBody(formatedJson)
	}

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col font-sans">
				<Navigation />

				<main className="flex-1 flex flex-col bg-gray-50 dark:bg-background">
					<div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
						{/* Header Section */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-2">
								<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">dbConnect API Builder</h1>
							</div>
							<p className="text-gray-600 dark:text-gray-400">Build and test your MongoDB API endpoints</p>
						</div>

						{/* Database and Collection Card */}
						<Card className="mb-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>Database & Collection</CardTitle>
									<Button onClick={() => setShowCreateCollectionModal(true)}>
										<Plus className="w-4 h-4 mr-2" />
										Create Collection
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Database</label>
										<div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
											<Database className="w-5 h-5 text-gray-500 dark:text-gray-400" />
											<span className="font-medium text-gray-900 dark:text-gray-100">{db}</span>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Collection</label>
										<Select value={selectedCollection} onValueChange={setSelectedCollection}>
											<SelectTrigger className="w-full justify-between">
												<SelectValue placeholder="Select a collection" />
											</SelectTrigger>
											<SelectContent>
												{userCollections.map((collection) => (
													<SelectItem key={collection.name} value={collection.name}>
														{collection.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Main Content - Side by Side Layout */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Request Configuration Card */}
							<Card className="h-full flex flex-col">
								<CardHeader>
									<CardTitle>Request Configuration</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Custom API URL Toggle */}
									<div>
										<div className="flex items-center justify-between mb-3">
											<label htmlFor="custom-api-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Custom API URL
											</label>
											<Switch id="custom-api-toggle" checked={useCustomUrl} onCheckedChange={setUseCustomUrl} />
										</div>
										<Input
											type="url"
											placeholder="https://your-api-url.com"
											value={getApiUrl()}
											disabled={!useCustomUrl}
											onChange={(e) => setCustomApiUrl(e.target.value)}
										/>
									</div>

									{/* HTTP Method Selection */}
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HTTP Method</label>
										<div className="flex gap-2" role="tablist">
											{methods.map((m) => (
												<button
													key={m}
													className={`px-5 py-2 rounded-lg font-bold shadow-sm border border-gray-200 transition-colors
                                            ${
												method === m
													? `${colors[m]} ring-2 ring-offset-2 ring-${
															m === 'GET' ? 'blue' : m === 'POST' ? 'green' : m === 'PUT' ? 'yellow' : 'red'
													  }-300`
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
											}`}
													type="button"
													role="tab"
													aria-selected={method === m}
													onClick={() => setMethod(m)}
												>
													{m}
												</button>
											))}
										</div>
									</div>

									{(method === 'GET' || method === 'DELETE') && (
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Object ID</label>
											<Input
												type="text"
												placeholder="Enter object ID"
												value={objectId}
												onChange={(e) => setObjectId(e.target.value)}
											/>
										</div>
									)}

									{/* HTTP Headers Section */}
									<div>
										<div className="flex items-center justify-between mb-4">
											<label className="text-sm font-medium text-gray-700 dark:text-gray-300">HTTP Headers</label>
											<div className="flex items-center gap-2">
												<Switch checked={useHeaders} onCheckedChange={setUseHeaders} />
											</div>
										</div>

										{useHeaders && (
											<div className="space-y-2">
												{headers.map((header, index) => (
													<div key={index} className="flex items-center gap-2">
														<input
															type="checkbox"
															checked={header.enabled}
															onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
															className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
														/>
														<Input
															type="text"
															value={header.key}
															onChange={(e) => updateHeader(index, 'key', e.target.value)}
															placeholder="header"
															className="flex-1"
														/>
														<Input
															type="text"
															value={header.value}
															onChange={(e) => updateHeader(index, 'value', e.target.value)}
															placeholder="value"
															className="flex-1"
														/>
														<Button onClick={() => removeHeader(index)} variant="ghost" size="icon">
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												))}
												<Button onClick={addHeader} variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
													+ Add Header
												</Button>
											</div>
										)}
									</div>

									{/* Request Body */}
									{(method === 'POST' || method === 'PUT') && (
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Request Body</label>
											<div className="flex flex-col w-full">
												<div className="flex items-center justify-between mb-2">
													<label className="font-medium text-sm text-gray-700 dark:text-gray-300" htmlFor="json-input">
														JSON Body
													</label>
													<Button variant="ghost" size="sm" type="button" onClick={() => handleJsonFormat(jsonBody)}>
														Format
													</Button>
												</div>
												<textarea
													id="json-input"
													className="resize-none w-full min-h-[120px] max-h-[280px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-mono text-sm text-gray-900 shadow-sm focus:(outline-none ring-2 ring-blue-200) transition-all"
													value={jsonBody}
													onChange={(e) => setJsonBody(e.target.value)}
													placeholder='{"key": "value"}'
													spellCheck={false}
													autoFocus
												/>
											</div>
										</div>
									)}

									{/* Options and Send Button */}
									<div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
										<div className="flex flex-wrap items-center gap-6">
											<label className="inline-flex items-center gap-2 cursor-pointer select-none group">
												<input
													type="checkbox"
													checked={encrypt}
													onChange={(e) => setEncrypt(e.target.checked)}
													className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
												/>
												<Lock className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
												<span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
													Encrypt Request
												</span>
											</label>
										</div>
										<Button onClick={handleSendRequest} className="bg-blue-600 hover:bg-blue-700">
											<Send className="w-4 h-4 mr-2" />
											Send Request
										</Button>
									</div>

									{/* Encrypted Request Output */}
									{encryptedRequest && (
										<div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
											<h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">Encrypted Request</h4>
											<pre className="text-xs text-yellow-700 dark:text-yellow-300 font-mono break-all whitespace-pre-wrap">
												{encryptedRequest}
											</pre>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Response Panel */}
							<Card className="h-full flex flex-col">
								<CardHeader>
									<CardTitle className="capitalize">{showSchema ? `${selectedCollection} Schema` : 'Response'}</CardTitle>
									<div className="flex justify-end items-center gap-2">
										<span className="text-sm">Show {showSchema ? 'Response' : 'Schema'}</span>
										<Switch checked={showSchema} onCheckedChange={setShowSchema} />
									</div>
								</CardHeader>
								<CardContent>
									{response || showSchema ? (
										<div className="w-full bg-gray-900 dark:bg-gray-950 rounded-lg shadow-inner p-4 mt-2 min-h-[300px] max-h-60 overflow-auto border border-gray-700 dark:border-gray-800">
											<SyntaxHighlighter
												language="json"
												style={atomDark}
												customStyle={{
													margin: 0,
													borderRadius: '0.375rem',
													maxHeight: 'auto',
													background: 'transparent',
												}}
												codeTagProps={{
													style: {
														fontFamily: '"Fira Code", "Dank Mono", monospace',
														fontSize: '0.875rem',
													},
												}}
											>
												{showSchema ? collectionSchema : response}
											</SyntaxHighlighter>
										</div>
									) : (
										<div className="w-full bg-gray-900 dark:bg-gray-950 rounded-lg shadow-inner p-4 mt-2 min-h-[300px] max-h-60 overflow-auto border border-gray-700 dark:border-gray-800">
											<p className="text-green-400 text-xs sm:text-sm font-mono opacity-80">// Response will be shown here</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</main>

				<CreateCollectionModal isOpen={showCreateCollectionModal} onClose={() => setShowCreateCollectionModal(false)} />

				<RequestConfirmationDialog
					isOpen={showRequestConfirmation}
					onClose={() => setShowRequestConfirmation(false)}
					method={method}
					headers={headers}
					url={getApiUrl()}
					data={getRequestData()}
					encrypt={encrypt}
				/>
			</div>
		</ProtectedRoute>
	)
}

export default AppDashboard
