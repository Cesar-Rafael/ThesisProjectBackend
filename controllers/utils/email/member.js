const nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "gmail",
  auth: {
    user: "certify.thesis@gmail.com",
    pass: "xhkrfdurngwweqpe",
  },
});

module.exports.sendPrivateKeyEmail = async (email, privateKey) => {
  await smtpTransport.sendMail({
    from: "certify.thesis@gmail.com",
    to: email,
    subject: "Asignación de cuenta de blockchain",
    text: `Su llave privada para la cuenta de metamask es: ${privateKey}`,
  });
};
