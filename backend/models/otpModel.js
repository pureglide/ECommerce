import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    purpose: { type: String, enum: ['register', 'forgot_password'], default: 'register' },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Document expires after 300 seconds (5 minutes)
});

// Compound index: one OTP per email per purpose
otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

const otpModel = mongoose.models.otp || mongoose.model("otp", otpSchema);

export default otpModel;
