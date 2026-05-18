import redis from '../config/redis.js';

const cache = (ttlSeconds = 60) => async (req, res, next) => {
  if (ttlSeconds === 0) return next();
  const key = `cache:${req.originalUrl}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      await redis.setex(key, ttlSeconds, JSON.stringify(data));
      return originalJson(data);
    };
  } catch {
    // Redis unavailable — skip cache, serve normally
  }

  next();
};

export const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length) await redis.del(...keys);
  } catch { /* silent */ }
};

export default cache;
