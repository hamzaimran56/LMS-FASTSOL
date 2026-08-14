import { clerkClient, getAuth } from '@clerk/express'

// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
    try {
        const auth = getAuth(req)
        const userId = auth?.userId || req.auth?.userId

        if (!userId) {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        const client = typeof clerkClient === 'function' ? await clerkClient() : clerkClient
        const response = await client.users.getUser(userId)

        if (response.publicMetadata.role !== 'educator') {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}