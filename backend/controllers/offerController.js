import { Offer, OfferVersion, Candidate, Template } from '../models/index.js';
import fillPlaceholders from '../utils/fillPlaceholders.js';
import { STATUS_TRANSITIONS } from '../utils/offerSchemas.js';
import { invalidateCache } from '../middleware/cache.js';

export const getAllOffers = async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};
  const offers = await Offer.findAll({
    where,
    include: [
      { model: Candidate, as: 'candidate', attributes: ['id', 'name', 'email', 'position', 'department'] },
      { model: Template, as: 'template', attributes: ['id', 'name'] },
    ],
    order: [['created_at', 'DESC']],
  });
  res.json(offers);
};

export const getOfferById = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id, {
    include: [
      { model: Candidate, as: 'candidate' },
      { model: Template, as: 'template' },
    ],
  });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  res.json(offer);
};

export const createOffer = async (req, res) => {
  const { candidate_id, template_id, salary, doj } = req.body;

  const candidate = await Candidate.findByPk(candidate_id);
  if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

  const template = await Template.findByPk(template_id);
  if (!template) return res.status(404).json({ message: 'Template not found' });

  const mergedCandidate = {
    ...candidate.toJSON(),
    ...(salary && { salary }),
    ...(doj && { doj }),
  };

  const filledContent = fillPlaceholders(template.content, mergedCandidate);

  const offer = await Offer.create({
    candidate_id,
    template_id,
    salary: salary || candidate.salary,
    doj: doj || candidate.doj,
    status: 'draft',
  });

  await OfferVersion.create({ offer_id: offer.id, version_no: 1, content: filledContent });

  res.status(201).json({ offer, content: filledContent });
};

export const updateOfferStatus = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offer not found' });

  const { status } = req.body;
  const allowed = STATUS_TRANSITIONS[offer.status];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: `Cannot transition from '${offer.status}' to '${status}'`,
      allowed,
    });
  }

  await offer.update({ status });
  await invalidateCache('/api/analytics*');
  res.json({ message: 'Status updated', offer });
};

export const getOfferVersions = async (req, res) => {
  const versions = await OfferVersion.findAll({
    where: { offer_id: req.params.id },
    order: [['version_no', 'DESC']],
  });
  res.json(versions);
};
