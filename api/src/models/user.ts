import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserType } from '../shared/types';


// Create a mongoose schema for the user
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
});

// Middleware to hash the password before saving to the database
userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
});

// Create a mongoose model for the User type
const User = mongoose.model<UserType>("User", userSchema);

export default User;