import { Offer, Candidate, OfferVersion, ScheduledEmail } from '../models/index.js';
import sendOfferEmail from '../services/emailService.js';
import generatePDF from '../services/pdfService.js';

const buildPdfData = (offer, candidate) => ({
  name: candidate.name,
  email: candidate.email,
  position: candidate.position,
  department: candidate.department,
  salary: offer.salary || candidate.salary,
  doj: offer.doj || candidate.doj,
  status: offer.status,
  companyName: process.env.COMPANY_NAME || 'Your Company',
  logoUrl: process.env.COMPANY_LOGO_URL || null,
  offerDate: offer.created_at,
});

export const sendOffer = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id, {
    include: [{ model: Candidate, as: 'candidate' }],
  });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });

  const latestVersion = await OfferVersion.findOne({
    where: { offer_id: offer.id },
    order: [['version_no', 'DESC']],
  });

  const pdfBuffer = await generatePDF(buildPdfData(offer, offer.candidate));

  await sendOfferEmail({
    to: offer.candidate.email,
    candidateName: offer.candidate.name,
    offerContent: latestVersion?.content || '',
    pdfBuffer,
  });

  await offer.update({ status: 'sent' });
  res.json({ message: 'Offer email sent with PDF attachment' });
};

export const scheduleOffer = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offer not found' });

  const { scheduled_at } = req.body;

  const scheduled = await ScheduledEmail.create({
    offer_id: offer.id,
    scheduled_at,
    status: 'pending',
    updated_by: req.user.id,
  });

  res.status(201).json({ message: 'Email scheduled', scheduled });
};

export const getScheduledEmails = async (req, res) => {
  const scheduled = await ScheduledEmail.findAll({
    where: { offer_id: req.params.id },
    order: [['scheduled_at', 'ASC']],
  });
  res.json(scheduled);
};
