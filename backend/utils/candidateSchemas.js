import Joi from 'joi';

export const candidateSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  position: Joi.string().allow('', null),
  department: Joi.string().allow('', null),
  doj: Joi.date().iso().allow(null),
  salary: Joi.string().allow('', null),
});

export const updateCandidateSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  position: Joi.string().allow('', null),
  department: Joi.string().allow('', null),
  doj: Joi.date().iso().allow(null),
  salary: Joi.string().allow('', null),
}).min(1);
