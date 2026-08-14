import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database Connected'))
    
    // Sirf MONGODB_URI pass karein kyunki /lms pehle se URL ke andar hai
    await mongoose.connect(process.env.MONGODB_URI)
}

export default connectDB;