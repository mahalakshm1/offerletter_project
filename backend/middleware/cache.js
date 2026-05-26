// Redis removed — cache is a no-op passthrough
const cache = (_ttl) => (_req, _res, next) => next();
export const invalidateCache = async () => {};
export default cache;
