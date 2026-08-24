import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";
import Subscriber from "../models/Subscriber.js";
import { Resend } from "resend"; // Resend Package Imported

// Helper Function to safely get userId
const getUserId = (req) => {
    const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
    return auth?.userId;
};

// Get User Data
export const getUserData = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        let user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found in DB' });
        }

        res.json({ success: true, user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        const userData = await User.findById(userId).populate('enrolledCourses');
        
        const purchases = await Purchase.find({ userId, status: 'completed' }).populate('courseId');
        const purchasedCourses = purchases.map(purchase => purchase.courseId).filter(Boolean);

        const combinedCoursesMap = new Map();
        
        if (userData && userData.enrolledCourses) {
            userData.enrolledCourses.forEach(course => {
                if (course) combinedCoursesMap.set(course._id.toString(), course);
            });
        }

        purchasedCourses.forEach(course => {
            if (course) combinedCoursesMap.set(course._id.toString(), course);
        });

        const enrolledCourses = Array.from(combinedCoursesMap.values());

        res.json({ success: true, enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Purchase Course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        
        const userId = getUserId(req);

        if (!userId) {
            return res.json({ success: false, message: 'Not Authorized' });
        }
        
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2),
            status: 'completed'
        };

        const newPurchase = await Purchase.create(purchaseData);

        await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseData._id } });
        await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY ? process.env.CURRENCY.toLowerCase() : "usd";

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { courseId, lectureId } = req.body;

    if (!userId) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: 'Lecture Already Completed' });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId]
      });
    }

    res.json({ success: true, message: 'Progress Updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: true, progressData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {
  const userId = getUserId(req);
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: 'Invalid Details' });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: 'Course not found.' });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: 'User has not purchased this course.'
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    return res.json({ success: true, message: 'Rating added' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Subscribe to Newsletter
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: 'Email is required' });
        }

        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.json({ success: false, message: 'This email is already subscribed!' });
        }

        await Subscriber.create({ email });

        res.json({ success: true, message: 'Subscribed successfully!' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Send Contact Email via Resend
export const sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: `${name} <onboarding@resend.dev>`, // Dynamic User Name set yahan hua hai
            to: process.env.RECEIVER_EMAIL,
            reply_to: email, // Direct user ko mobile se reply dene ke liye
            subject: `FastSol Contact: ${subject || 'New Message'}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                  <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                  <p><strong>Message:</strong></p>
                  <div style="background: #f9fafb; padding: 12px; border-left: 4px solid #2563eb; margin-top: 5px;">
                    ${message}
                  </div>
                </div>
            `
        });

        res.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};