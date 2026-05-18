import { AuditLog } from '../models/index.js';

export const getLogs = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await AuditLog.findAndCountAll({
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset,
  });

  res.json({ total: count, page: Number(page), pages: Math.ceil(count / limit), logs: rows });
};
