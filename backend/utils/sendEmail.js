const nodeMiler = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMiler.createTransport({
    service: process.env.SMPT_SERVICE,  
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });
  console.log(process.env.MAIL);
  console.log(process.env.PASSWORD);
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
