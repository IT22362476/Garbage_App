// utils/email.js
// Utility for sending emails using nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service
  auth: {
    user: process.env.EMAIL_USER, // Set in .env
    pass: process.env.EMAIL_PASS, // Set in .env
  },
});

async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your email address',
    html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
