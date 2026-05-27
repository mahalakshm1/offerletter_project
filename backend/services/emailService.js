import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOfferEmail = async ({ to, candidateName, offerContent, pdfBuffer }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Your Offer Letter — ${process.env.COMPANY_NAME || 'Our Company'}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <div style="background:#1a237e;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h2 style="color:white;margin:0;">${process.env.COMPANY_NAME || 'Our Company'}</h2>
          <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;">Offer Letter</p>
        </div>
        <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>We are pleased to share your offer letter. Please find it attached as a PDF to this email.</p>
          <div style="background:#f8f9ff;border-left:4px solid #1a237e;padding:16px 20px;border-radius:4px;margin:20px 0;">
            ${offerContent}
          </div>
          <p style="color:#64748b;font-size:13px;">Please review the attached PDF and confirm your acceptance within <strong>7 days</strong>.</p>
          <p>Regards,<br/><strong>HR Team</strong><br/>${process.env.COMPANY_NAME || 'Our Company'}</p>
        </div>
      </div>
    `,
    attachments: pdfBuffer ? [{
      filename: `offer-letter-${candidateName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }] : [],
  });
};

export default sendOfferEmail;
