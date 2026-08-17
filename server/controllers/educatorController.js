import { clerkClient, getAuth } from '@clerk/express'
import Course from '../models/Course.js'
import User from '../models/User.js'
import Purchase from '../models/Purchase.js'
import { v2 as cloudinary } from 'cloudinary'

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const auth = getAuth(req)
        const userId = auth?.userId

        if (!userId) {
            return res.json({ 
                success: false, 
                message: 'Auth session missing or token unverified. Check your Secret Key.' 
            })
        }

        const client = typeof clerkClient === 'function' ? await clerkClient() : clerkClient;

        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })

        return res.json({ 
            success: true, 
            message: 'You can publish a course now' 
        })

    } catch (error) {
        return res.json({ 
            success: false, 
            message: error.message 
        })
    }
}

// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        
        const auth = getAuth(req)
        const educatorId = auth?.userId || req.auth?.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const auth = getAuth(req)
        const educator = auth?.userId || req.auth?.userId

        const courses = await Course.find({ educator })
        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data (Total Earnings, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const auth = getAuth(req)
        const educator = auth?.userId || req.auth?.userId

        const courses = await Course.find({ educator })
        const totalCourses = courses.length

        const courseIds = courses.map(course => course._id)

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = []
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl')

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const auth = getAuth(req)
        const educator = auth?.userId || req.auth?.userId

        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })
        .populate('userId', 'name imageUrl')
        .populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({ success: true, enrolledStudents })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}