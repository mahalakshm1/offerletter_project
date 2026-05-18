import { Offer, Candidate } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';

export const getOverview = async (req, res) => {
  const total = await Offer.count();
  const totalCandidates = await Candidate.count();

  const accepted = await Offer.count({ where: { status: 'accepted' } });
  const rejected = await Offer.count({ where: { status: 'rejected' } });
  const sent = await Offer.count({ where: { status: 'sent' } });

  const acceptanceRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0;

  res.json({ total, totalCandidates, accepted, rejected, sent, acceptanceRate: `${acceptanceRate}%` });
};

export const getByStatus = async (req, res) => {
  const results = await Offer.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['status'],
    raw: true,
  });
  res.json(results);
};

export const getByDepartment = async (req, res) => {
  const results = await sequelize.query(
    `SELECT c.department, COUNT(o.id) AS count
     FROM offers o
     JOIN candidates c ON o.candidate_id = c.id
     GROUP BY c.department
     ORDER BY count DESC`,
    { type: QueryTypes.SELECT }
  );
  res.json(results);
};

export const getOverTime = async (req, res) => {
  const results = await sequelize.query(
    `SELECT DATE_TRUNC('day', created_at) AS date, COUNT(id) AS count
     FROM offers
     GROUP BY DATE_TRUNC('day', created_at)
     ORDER BY date ASC`,
    { type: QueryTypes.SELECT }
  );
  res.json(results);
};
