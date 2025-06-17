import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useApp } from '@/context/AppContext'

const RequestConfirmationDialog = ({ isOpen, onClose, method, headers = [], url, data, encrypt, encryptedData }) => {
	const { confirmHandler } = useApp()

	// Function to transform headers to an object with enabled headers only
	const transformHeadersToObject = (headersArray) => {
		const headersObject = {}

		headersArray.forEach((header) => {
			if (header.enabled) {
				headersObject[header.key] = header.value
			}
		})

		return headersObject
	}

	const getRequestPreview = () => {
		// If the method is GET or DELETE, there should be no body.

		let dataPreview = data

		if (encrypt) {
			dataPreview = encryptedData
		}

		const apiRequest1 = {
			method,
			url,
			headers: transformHeadersToObject(headers),
		}

		const apiRequest2 = {
			method,
			url,
			headers: transformHeadersToObject(headers),
			data: { encrypted: encrypt, data: dataPreview },
		}

		if (method === 'GET' || method === 'DELETE') {
			return `axios(${JSON.stringify(apiRequest1, null, 2)});`
		}

		return `axios(${JSON.stringify(apiRequest2, null, 2)});`
	}

	const handleConfirm = async () => {
		const transformedHeaders = transformHeadersToObject(headers)

		try {
			if (encrypt) {
				await confirmHandler(method, url, transformedHeaders, { encrypted: encrypt, data: encryptedData })
			} else {
				await confirmHandler(method, url, transformedHeaders, { encrypted: encrypt, data })
			}
		} catch (err) {
			console.error('Error:', err)
		}
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Request</AlertDialogTitle>
					<AlertDialogDescription>Review your request before sending:</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="w-full bg-gray-900 dark:bg-gray-950 rounded-lg shadow-inner p-4 mt-2 min-h-[100px] max-h-60 overflow-auto border border-gray-700 dark:border-gray-800">
					<pre className="text-green-300 dark:text-green-300 text-xs sm:text-sm font-mono break-words whitespace-pre-wrap">
						{getRequestPreview()}
					</pre>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Confirm & Send Request</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default RequestConfirmationDialog
