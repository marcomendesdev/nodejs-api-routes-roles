import nodemailer from "nodemailer";

const verifyEmail = async (email, link) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Verify your email",
      text: `Welcome to the site! Please verify your email!`,
      html: `<p>Click this link to verify your email: <a href="${link}">Click here to activate your account</a></p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Email failed to send", error);
  }
};

export default verifyEmail;
