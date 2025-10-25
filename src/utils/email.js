import { mailTransporter } from "../configs/transport.mail.js";

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL, // Sender email address from environment variables
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #121212; padding: 60px 0;">
  <div style="max-width: 520px; background: #1e1e1e; margin: 0 auto; border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.6); overflow: hidden; border: 1px solid #2c2c2c;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ff4d6d, #ff7a59); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">Verify Your Email</h1>
    </div>

    <!-- Body -->
    <div style="padding: 40px 32px; text-align: center; color: #e0e0e0;">
      <p style="font-size: 16px; margin-bottom: 10px;">Hello 👋,</p>
      <p style="font-size: 15px; margin-bottom: 30px; line-height: 1.7;">
        Use the <strong>One-Time Password (OTP)</strong> below to verify your email address and complete your registration.
      </p>

      <!-- OTP Code -->
      <p style="font-size: 38px; letter-spacing: 10px; font-weight: 800; color: #ff4d6d; margin-bottom: 30px; background: #2c2c2c; display: inline-block; padding: 12px 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
        ${otp}
      </p>

      <p style="font-size: 14px; color: #aaaaaa; margin-bottom: 40px;">
        This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone.
      </p>

      <!-- Verify Button -->
      <a href="#" style="background: linear-gradient(135deg, #ff4d6d, #ff7a59); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.5); transition: all 0.3s ease;">
        Verify Now
      </a>
    </div>

    <!-- Footer -->
    <div style="background: #1a1a1a; padding: 20px; text-align: center; font-size: 13px; color: #777;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Okway Home Decore. All rights reserved.</p>
    </div>

  </div>
</div>
    `,
  };
  await mailTransporter.sendMail(mailOptions);
};
