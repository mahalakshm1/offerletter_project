import cron from 'node-cron';
import { Op } from 'sequelize';
import { ScheduledEmail, Offer, Candidate, OfferVersion } from '../models/index.js';
import sendOfferEmail from './emailService.js';

const startCronJobs = () => {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    const due = await ScheduledEmail.findAll({
      where: {
        status: 'pending',
        scheduled_at: { [Op.lte]: new Date() },
      },
      include: [{ model: Offer, include: [{ model: Candidate, as: 'candidate' }] }],
    });

    for (const scheduled of due) {
      try {
        const offer = scheduled.Offer;
        const candidate = offer.candidate;

        const latestVersion = await OfferVersion.findOne({
          where: { offer_id: offer.id },
          order: [['version_no', 'DESC']],
        });

        await sendOfferEmail({
          to: candidate.email,
          candidateName: candidate.name,
          offerContent: latestVersion?.content || '',
        });

        await scheduled.update({ status: 'sent' });
        await offer.update({ status: 'sent' });
      } catch {
        await scheduled.update({ status: 'failed' });
      }
    }
  });

  console.log('Cron jobs started');
};

export default startCronJobs;
