import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.warn('Redis error:', err.message));

export default redis;
