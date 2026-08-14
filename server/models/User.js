import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        imageUrl: { type: String, required: true },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
    }, 
    { timestamps: true }
);

// Check if model already exists to prevent overwrite error during hot reloads / serverless environments
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;