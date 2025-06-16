import { SignJWT } from 'jose'
import { toast } from 'sonner'

export const encryptedData = async (data, secret, router) => {
	if (!secret) {
		toast.error('No Secret Key found!', {
			description: 'Please generate secret key in settings',
			action: {
				label: 'Settings',
				onClick: () => router.push('/settings'),
			},
		})
		return null
	} else {
		return await new SignJWT(data)
			.setProtectedHeader({ alg: 'HS256' }) // Set the signing algorithm
			.setExpirationTime('1h') // Set expiration for the token
			.sign(new TextEncoder().encode(secret)) // Signing the payload with the secret
	}
}

export const encryptPayload = async (data, secret) => {
	return await new SignJWT(data)
		.setProtectedHeader({ alg: 'HS256' }) // Set the signing algorithm
		.setExpirationTime('1h') // Set expiration for the token
		.sign(new TextEncoder().encode(secret)) // Signing the payload with the secret
}
