import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import nodemailer from 'nodemailer';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password, otp } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // OTP Verification Flow
        if (!otp) {
            // Generate 6-digit OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            // Store OTP in DB (upsert: true creates if not exists, updates if it does)
            await otpModel.findOneAndUpdate(
                { email, purpose: 'register' },
                { otp: generatedOtp, createdAt: Date.now() },
                { upsert: true }
            );

            // Send Email
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Use your preferred service or host/port from env
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: 'Email Verification - Pure Glide',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #333; text-align: center;">Welcome to Pure Glide!</h2>
                        <p style="font-size: 16px; color: #555; text-align: center;">Please use the following code to verify your account:</p>
                        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #000;">${generatedOtp}</div>
                        <p style="font-size: 14px; color: #888; text-align: center;">This code expires in 5 minutes.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);

            // Return specific response so frontend knows to show OTP input
            return res.json({ success: false, message: "OTP sent to your email", otpSent: true });
        }

        // Verify OTP
        const otpRecord = await otpModel.findOne({ email, purpose: 'register' });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        // Delete OTP after successful registration
        await otpModel.deleteOne({ email, purpose: 'register' });

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Request OTP for forgot password
const forgotPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const user = await userModel.findOne({ email });
        const genericMessage = "If an account exists with this email, you will receive an OTP shortly.";

        if (!user) {
            // Don't reveal if user exists (security - prevent email enumeration)
            return res.json({ success: true, message: genericMessage, otpSent: false });
        }

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        await otpModel.findOneAndUpdate(
            { email, purpose: 'forgot_password' },
            { otp: generatedOtp, createdAt: Date.now() },
            { upsert: true }
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Reset Password - Pure Glide',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">Use the following code to reset your password:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #000;">${generatedOtp}</div>
                    <p style="font-size: 14px; color: #888; text-align: center;">This code expires in 5 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent to your email", otpSent: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Reset password with OTP verification
const forgotPasswordReset = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (!otp) {
            return res.json({ success: false, message: "OTP is required" });
        }
        if (!newPassword || newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const otpRecord = await otpModel.findOne({ email, purpose: 'forgot_password' });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        await otpModel.deleteOne({ email, purpose: 'forgot_password' });

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export { loginUser, registerUser, adminLogin, forgotPasswordRequest, forgotPasswordReset }