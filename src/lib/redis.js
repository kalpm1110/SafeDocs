// lib/redis.js
import { createClient } from "redis";

let redis;

if (!global.redisClient) {
  global.redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PW,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  global.redisClient.on("error", (err) => console.log("Redis Client Error", err));

  // Connect once
  global.redisClient.connect().catch(console.error);
}

redis = global.redisClient;

export default redis;