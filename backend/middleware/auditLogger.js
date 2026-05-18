import { AuditLog } from '../models/index.js';

const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const auditLogger = (req, res, next) => {
  if (!WRITE_METHODS.includes(req.method)) return next();

  res.on('finish', async () => {
    if (res.statusCode >= 400) return;
    try {
      const parts = req.path.split('/').filter(Boolean);
      const resource_id = parts[parts.length - 1] || null;
      const action = `${req.method} ${req.route?.path || req.path}`;

      await AuditLog.create({
        user_id: req.user?.id || null,
        user_email: req.user?.email || null,
        method: req.method,
        route: req.originalUrl,
        action,
        resource_id: resource_id?.length === 36 ? resource_id : null,
        ip: req.ip,
      });
    } catch { /* silent — never block request */ }
  });

  next();
};

export default auditLogger;
