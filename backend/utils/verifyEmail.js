import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import nodemailer from "nodemailer";

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const verifyEmail = async (email, link) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const sanitizedLink = DOMPurify.sanitize(link);

    let info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Verify your email",
      text: `Welcome to the site! Please verify your email!`,
      html: `<p>Click this link to verify your email: <a href="${sanitizedLink}">Click here to activate your account</a></p>`,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Email failed to send", error);
  }
};

export default verifyEmail;