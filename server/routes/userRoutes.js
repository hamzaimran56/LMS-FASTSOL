import express from 'express'
import { 
    addUserRating, 
    getUserCourseProgress, 
    getUserData, 
    purchaseCourse, 
    sendContactEmail, // Added sendContactEmail
    subscribeNewsletter,
    updateUserCourseProgress, 
    userEnrolledCourses 
} from '../controllers/userController.js'
import { requireAuth } from '@clerk/express'

const userRouter = express.Router()

userRouter.get('/data', requireAuth(), getUserData)
userRouter.get('/enrolled-courses', requireAuth(), userEnrolledCourses)
userRouter.post('/purchase', requireAuth(), purchaseCourse)

userRouter.post('/update-course-progress', requireAuth(), updateUserCourseProgress)
userRouter.post('/get-course-progress', requireAuth(), getUserCourseProgress)
userRouter.post('/add-rating', requireAuth(), addUserRating)

// Public route for newsletter subscription
userRouter.post('/subscribe', subscribeNewsletter)

// Public route for contact form submission
userRouter.post('/contact', sendContactEmail) // Added Contact Route

export default userRouter;