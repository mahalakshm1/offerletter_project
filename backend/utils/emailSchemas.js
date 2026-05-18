import Joi from 'joi';

export const scheduleEmailSchema = Joi.object({
  scheduled_at: Joi.date().iso().greater('now').required(),
});
