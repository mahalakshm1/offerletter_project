import sequelize from '../config/db.js';
import User from './User.js';
import Template from './Template.js';
import TemplateVersion from './TemplateVersion.js';
import Candidate from './Candidate.js';
import Offer from './Offer.js';
import OfferVersion from './OfferVersion.js';
import ScheduledEmail from './ScheduledEmail.js';

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('All models synced to Neon DB');
};

export { sequelize, syncDB, User, Template, TemplateVersion, Candidate, Offer, OfferVersion, ScheduledEmail };
