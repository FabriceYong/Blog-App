import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
    },
    isAdmin: {
      type: Boolean,
      default: false 
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
export default User
