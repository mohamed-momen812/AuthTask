const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey", // SendGrid requires 'apikey' as the username
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Email Verification",
    text: `Click the link to verify your email: ${process.env.BASE_URL}/api/auth/verify-email?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendVerificationEmail;
