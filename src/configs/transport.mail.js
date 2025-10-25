import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const mailTransporter  = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});