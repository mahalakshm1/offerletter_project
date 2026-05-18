import Joi from 'joi';

export const createTemplateSchema = Joi.object({
  name: Joi.string().min(2).required(),
  content: Joi.string().min(10).required(),
});

export const updateTemplateSchema = Joi.object({
  name: Joi.string().min(2),
  content: Joi.string().min(10),
}).min(1);
