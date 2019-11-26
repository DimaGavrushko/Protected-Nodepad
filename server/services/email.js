const nodemailer = require('nodemailer');
const utils = require('../utils/utils');
const User = require("../models/user");
const bcrypt = require('bcryptjs');

async function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const token = utils.generateRandomString(128);
    const hashedToken = await bcrypt.hash(token, 10);
    await User.updateOne({ email }, { token: hashedToken });

    await transporter.sendMail({
        from: '"Protected Notepad" <protectedNotepad@gmail.com>',
        to: email,
        subject: "Activation token",
        text: token
    });
}

module.exports = sendEmail;
