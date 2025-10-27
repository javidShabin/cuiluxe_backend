import { mailTransporter } from "../configs/transport.mail.js";

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
  
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #1f2937;">Verify Your Email</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">Hello,</p>
              
              <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #6b7280;">
                Please use the verification code below to complete your email verification process.
              </p>
              
              <!-- OTP Display -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 32px; text-align: center; margin: 0 0 32px;">
                <p style="margin: 0 0 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.5px;">Your Verification Code</p>
                <p style="margin: 0; font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
              </div>
              
              <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.6; color: #9ca3af; text-align: center;">
                This code will expire in <strong style="color: #374151;">10 minutes</strong>.
              </p>
              
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; font-weight: 500; color: #374151;">Cuiluxe</p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} Cuiluxe. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
    `,
  };
  await mailTransporter.sendMail(mailOptions);
};
