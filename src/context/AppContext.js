'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SERVER_URL } from '@/config/config'

// Create a context for managing tasks
const AppContext = createContext(undefined)

// Custom hook to access the task context
export const useApp = () => {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error('useApp must be used within an AppProvider')
	}
	return context
}

// AppProvider component to manage and provide task-related state
export const AppProvider = ({ children }) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [userState, setUserState] = useState(null)
	const [userCollections, setUserCollections] = useState([])
	const [response, setResponse] = useState()

	const authToken = Cookies.get('auth_token')

	useEffect(() => {
		if (authToken) {
			fetchUserData() // Fetch user data if logged in
		}
	}, [authToken])

	const fetchUserCollections = async (db) => {
		try {
			const res = await axios.get(`${SERVER_URL}/api/app/collection?db=${db}`, {
				headers: { 'x-auth-token': authToken },
			})

			setUserCollections(res.data.data)
		} catch (err) {
			toast.error('Error fetching collections.')
			console.error('Error fetching collections:', err)
		}
	}

	// Fetch user data
	const fetchUserData = async () => {
		if (!authToken) return
		try {
			setLoading(true)

			const res = await axios.get(`${SERVER_URL}/api/user`, {
				headers: { 'x-auth-token': authToken },
			})

			const user = res.data.data

			if (user) {
				await fetchUserCollections(user.db)
				setUserState(user)
			} else {
				localStorage.clear()
				Cookies.remove('auth_token')
				toast.error('User not found, please try again or create an account.')
				router.push('/')
			}
		} catch (err) {
			localStorage.clear()
			Cookies.remove('auth_token')
			console.error('Error during user fetch:', err)
			router.push('/')
		} finally {
			setLoading(false)
		}
	}

	const createCollectionHandler = async (db, collectionName, collectionSchema) => {
		try {
			const res = await axios.post(
				`${SERVER_URL}/api/app/${collectionName}?db=${db}`,
				{ collectionSchema },
				{ headers: { 'Content-Type': 'application/json' } }
			)

			if (res.status === 200) {
				toast.success('Collection created successfully.')
				await fetchUserData()
			}
		} catch (err) {
			toast.error('Error creating collection.')
			console.error('Error creating collection:', err)
		}
	}

	// Perform the action (e.g., add, update, delete tasks)
	const performAction = async (actionType, { method, url, headers, data }) => {
		setLoading(true)

		try {
			let request = { method, url, headers, data: { data } }

			// Axios request
			const res = await axios(request)

			const json = res.data

			await fetchUserData()

			setResponse(JSON.stringify(json.data, null, 2))
			toast.success(json.message || 'Action succeeded') // Success toast
		} catch (err) {
			toast.error(err.response?.data?.message || 'Action failed') // Error toast
		} finally {
			setLoading(false)
		}
	}

	const confirmHandler = (method, url, headers, data) => {
		performAction('postHandler', { method, url, headers, data })
	}

	return (
		<AppContext.Provider value={{ ...userState, userState, userCollections, confirmHandler, createCollectionHandler, response, loading }}>
			{children}
		</AppContext.Provider>
	)
}
