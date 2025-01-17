import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "lamont.zboncak42@ethereal.email",
    pass: "VZM9kW2EqyrgpwSdpa",
  },
});

export const sendTokenMessage = async ({ email, token }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Segun 👻" <lamont.zboncak42@ethereal.email>', // sender address
      to: `${email}`, // list of receivers
      subject: "Hello", // Subject line
      text: `Your Token is ${token}`, // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    console.log("Message sent: %s", info.messageId);
    return { message: "Token has been sent " };
  } catch (error) {
    return null;
  }
};
