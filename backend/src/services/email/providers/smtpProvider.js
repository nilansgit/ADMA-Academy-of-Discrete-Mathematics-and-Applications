import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const smtpProvider = {
  send: async ({ to, subject, html, from }) => {
    return await transporter.sendMail({
      from: `"Academy of Discrete Mathematics and Applications (ADMA)" <${from || process.env.DEFAULT_FROM}>`,
      to,
      subject,
      html,
    });
  },
};