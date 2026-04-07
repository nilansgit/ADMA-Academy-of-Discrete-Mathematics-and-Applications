import { sendEmail } from "./src/services/email/emailService.js";
import { freshAppSubmit } from "./src/services/email/providers/templates/freshAppSubmit.js";

const run = async () => {
  return await sendEmail({
    to: "shyam.kamath@gmail.com",
    subject: `(TEST) Application Submitted Successfully`,
    html: freshAppSubmit({name: "Shyam Kamath",applicationNumber: "ADMA-2026-001"}),
    from: "no-reply@adma.co.in"
  });
};

run();