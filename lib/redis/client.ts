import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedisInstance() {
  if (!redis) {
    redis = Redis.fromEnv();
  }
  return redis;
}
