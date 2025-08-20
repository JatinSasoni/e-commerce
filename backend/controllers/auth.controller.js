import jwt from 'jsonwebtoken'
import { User } from '../models/User.js';
import { validationResult } from 'express-validator';
//register user 

// Generate OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};
export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const user = new User({
            name,
            email,
            password,
            otp,
            otpExpires,
        });

        await user.save();

        // Send OTP email
        try {
            await sendOTPEmail(email, otp, name);
            res.status(201).json({
                message:
                    "User registered successfully. Please check your email for OTP verification.",
                userId: user._id,
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            res.status(201).json({
                message:
                    "User registered successfully, but email sending failed. Please try again.",
                userId: user._id,
            });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "Jatin@123",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Email verified successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            // re-generate OTP and send email
            const otp = generateOTP();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            await sendOTPEmail(user.email, otp, user.name);

            return res.status(400).json({
                message: "Email not verified. We sent you a new OTP.",
                resend: true,
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "Jatin@123",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
export const profileController = async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                address: req.user.address,
                isVerified: req.user.isVerified,
            },
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const optResendController = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        try {
            await sendOTPEmail(email, otp, user.name);
            res.json({ message: "OTP sent successfully" });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            res.status(500).json({ message: "Failed to send email" });
        }
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: "Server error" });
    }
}