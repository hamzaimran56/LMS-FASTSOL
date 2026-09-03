import { clerkClient, getAuth } from '@clerk/express'

// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
    try {
        const auth = getAuth(req)
        const userId = auth?.userId || req.auth?.userId

        if (!userId) {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        // Custom Admin/Educator Login Access:
        // Yahan role check ko bypass kar ke har logged-in user ko educator access allow kar diya hai
        next()

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}