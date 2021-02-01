const nodemailer = require("nodemailer");

// nodemailer.com
const sendEmail = async(mailOptions) => {
     
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT, //587
        auth: {
          user: process.env.SMTP_USER,
          pass : process.env.SMTP_PASS
        }
});
  let info = await transporter.sendMail(mailOptions);
  console.log(`Message Sent: ${info.messageId}`);
}
module.exports = sendEmail;