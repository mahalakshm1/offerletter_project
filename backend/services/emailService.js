import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOfferEmail = async ({ to, candidateName, offerContent }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your Offer Letter',
    html: `
      <p>Dear ${candidateName},</p>
      <p>Please find your offer letter below:</p>
      <hr/>
      ${offerContent}
      <hr/>
      <p>Regards,<br/>HR Team</p>
    `,
  });
};

export default sendOfferEmail;
