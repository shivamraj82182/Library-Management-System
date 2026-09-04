import { Resend } from "resend";

const sendOtp = async (email, otp) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "ShelfWise Library <onboarding@resend.dev>",
            to: [email],
            subject: "Your ShelfWise Library OTP",
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Password Reset OTP</h2>
                    <p>Your OTP for resetting your password is:</p>
                    <h1>${otp}</h1>
                    <p>This OTP is valid for a limited time.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            throw new Error(error.message);
        }

        console.log("OTP email sent successfully:", data?.id);

        return data;
    } catch (error) {
        console.error("Error sending reset OTP:", error);
        throw error;
    }
};

export default sendOtp;