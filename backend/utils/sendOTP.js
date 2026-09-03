import { createTransport } from "nodemailer";

const sendOtp = async (email, otp) => {

    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        family: 4,

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Library Management System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
            <h2>Your OTP is ${otp}</h2>
            <p>Your OTP for password reset is <strong>${otp}</strong>.</p>
        `,
    });
};

export default sendOtp;