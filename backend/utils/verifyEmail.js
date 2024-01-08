import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import nodemailer from "nodemailer";

const window = new JSDOM("").window;
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
      html: `<section style="max-width: 100%; padding: 16px 24px; margin: auto; background-color: #ffffff;">
      <header>
          <a href="#">
              <img style="width: auto; max-height: 32px;" src="http://merakiui.com/images/full-logo.svg" alt="logo">
          </a>
      </header>
  
      <main style="margin-top: 16px;">
          <h2 style="color: #333333; dark-color: #c8c8c8;">Hi Olivia,</h2>
  
          <p style="margin-top: 8px; line-height: 1.5; color: #666666; dark-color: #999999;">
              Alicia has invited you to join the team on <span style="font-weight: bold;">Meraki UI</span>.
          </p>
          
          <button style="padding: 8px 24px; margin-top: 16px; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; color: #ffffff; text-transform: capitalize; transition: background-color 300ms, transform 300ms; background-color: #3490dc; border-radius: 8px; cursor: pointer; border: none; outline: none; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); hover-background-color: #2779bd;">
          <a href="${sanitizedLink}">Click here to activate your account</a>
          </button>
          
          <p style="margin-top: 24px; color: #666666; dark-color: #999999;">
              Thanks, <br>
              Meraki UI team
          </p>
      </main>
  
      <footer style="margin-top: 16px;">
          <p style="color: #888888; dark-color: #666666;">
              This email was sent to <a href="#" style="color: #3490dc; text-decoration: none; hover-color: #2677af; dark-color: #2677af;" target="_blank">contact@merakiui.com</a>. 
              If you'd rather not receive this kind of email, you can <a href="#" style="color: #3490dc; text-decoration: none; hover-color: #2677af; dark-color: #2677af;">unsubscribe</a> or <a href="#" style="color: #3490dc; text-decoration: none; hover-color: #2677af; dark-color: #2677af;">manage your email preferences</a>.
          </p>
  
          <p style="margin-top: 8px; color: #888888; dark-color: #666666;">© <span id="currentYear" style="color: #333333;"></span> Meraki UI. All Rights Reserved.</p>
      </footer>
  
      <script>
          document.getElementById('currentYear').textContent = new Date().getFullYear();
      </script>
  </section> `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Email failed to send", error);
  }
};

export default verifyEmail;
