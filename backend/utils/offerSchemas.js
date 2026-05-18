import Joi from 'joi';

const VALID_STATUSES = ['draft', 'generated', 'sent', 'viewed', 'accepted', 'rejected', 'expired'];

const STATUS_TRANSITIONS = {
  draft: ['generated'],
  generated: ['sent'],
  sent: ['viewed'],
  viewed: ['accepted', 'rejected'],
  accepted: ['expired'],
  rejected: [],
  expired: [],
};

export const createOfferSchema = Joi.object({
  candidate_id: Joi.string().uuid().required(),
  template_id: Joi.string().uuid().required(),
  salary: Joi.string().allow('', null),
  doj: Joi.date().iso().allow(null),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(...VALID_STATUSES).required(),
});

export { STATUS_TRANSITIONS };
