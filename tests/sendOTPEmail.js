const nodemailer = require('nodemailer');

async function sendOTPEmail({ to, name, otp }) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'class.nexus69@gmail.com',       // 🔒 Your Gmail
            pass: 'svey lzwl ozif touy',          // 🔐 App Password (not Gmail password)
        },
    });

    const mailOptions = {
        from: '"Musicfy" <your-email@gmail.com>',
        to,
        subject: 'Your Musicfy OTP Verification Code',
        html: `<h2>Hello ${name},</h2><p>Your OTP is: <strong>${otp}</strong></p>`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendOTPEmail;
