import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.DB_URL).then(() => console.log('Connected to database')).catch((err) => {
        console.error(`Error: ${err.message}`)
        process.exit(1)
    })
}

export default connectDB