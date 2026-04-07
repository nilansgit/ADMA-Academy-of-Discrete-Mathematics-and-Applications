import { smtpProvider } from "./providers/smtpProvider.js";


export const sendEmail = async ({ to, subject, html, from }) => {
  try {
    const result = await smtpProvider.send({ to, subject, html, from });
    console.log("Email sent to:", to, result);
  } catch (err) {
    console.error("Email error:", err);
  }
};