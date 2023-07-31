const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { EMAIL_API_KEY } = process.env;

sgMail.setApiKey(EMAIL_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "vla.dvorovenko@gmail.com" };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;
