import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2),
  role: Joi.string().valid('admin', 'hr'),
}).min(1);
