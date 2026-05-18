import { Offer, Candidate, OfferVersion, ScheduledEmail } from '../models/index.js';
import sendOfferEmail from '../services/emailService.js';

export const sendOffer = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id, {
    include: [{ model: Candidate, as: 'candidate' }],
  });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });

  const latestVersion = await OfferVersion.findOne({
    where: { offer_id: offer.id },
    order: [['version_no', 'DESC']],
  });

  await sendOfferEmail({
    to: offer.candidate.email,
    candidateName: offer.candidate.name,
    offerContent: latestVersion?.content || '',
  });

  await offer.update({ status: 'sent' });
  res.json({ message: 'Offer email sent successfully' });
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
