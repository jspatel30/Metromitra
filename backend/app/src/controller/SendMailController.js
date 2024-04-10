const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const sendMailToUser = (req, res) => {

  const name = req.body.name
  const mail = req.body.mail
  const message = req.body.message
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jspatel3003@gmail.com', // Your Gmail address
      pass: 'raalxzzmocklmoxc' // Your Gmail password or app-specific password if 2FA is enabled
    }
  });

  // Setup email data with unicode symbols
  const mailOptions = {
    from: 'jspatel3003@gmail.com', // Sender address
    to: mail, // List of recipients
    subject: 'Update from METROMITRA', // Subject line
    html: '<h4>Dear ' + name + '!</h4> <p>' + message + '</p>' // HTML body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({
        message: "Server Error",
        error: error
      })
    }
    res.status(200).json({
      message: "Email Sent Successfully",
      data: info.messageId
    })
    console.log('Message sent: %s', info.messageId);
  });
}


module.exports = {
  sendMailToUser
}