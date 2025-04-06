import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Job Hunt" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: subject,
    text: message, // fallback for older clients
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px; line-height: 1.5;">
        <h2 style="color: #4CAF50;">🚀 New Job Alert!</h2>
        <p>Hey there,</p>
        <p>A new job titled <strong style="color: #333;">"${subject.replace("🚀 New Job Posted: ", "")}"</strong> has just been posted on <strong>Job Hunt</strong>.</p>
        <p><a href="http://localhost:5173/jobs" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">View Job</a></p>
        <p>Happy hunting!<br/>The Job Hunt Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
