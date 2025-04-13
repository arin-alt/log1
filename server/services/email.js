import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  TWO_FACTOR_EMAIL_TEMPLATE
} from "../services/emailTemplates.js";

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

export const sendVerificationEmail = async (to, verificationCode) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Verify Your Email - Nodado General Hospital Logistics",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationCode
    ),
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (to, resetURL) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Reset Your Password - Nodado General Hospital Logistics",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetSuccessEmail = async (to) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Password Reset Successful - Nodado General Hospital Logistics",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Welcome to Nodado General Hospital Logistics",
    html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
  };

  await transporter.sendMail(mailOptions);
};

export const send2FACode = async (to, code) => {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: "Two Factor Authentication Code - NGH Logistics",
      html: TWO_FACTOR_EMAIL_TEMPLATE.replace("{2faCode}", code),
    };
  
    await transporter.sendMail(mailOptions);
  };