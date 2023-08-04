import redis, {RedisClientType} from 'redis';

interface redisConfig {
    host:string,
    port:string,
    password:string
}

export let redisCli : RedisClientType;

export async function ConnectRedis( config : redisConfig ){
   redisCli = redis.createClient({
      url: `redis://${config.host}:${config.port}`,
      password:config.password,
      database:0
   });

   redisCli.on('connect', () => {
      console.info('redis connected!');
   });
  
   redisCli.on('error', (err:any) => {
      console.error('Redis Client Error', err);
   });
  
   redisCli.on('ready', () => {
      // console.log('Redis Client is ready');
   });

   redisCli.on('reconnecting', () => {
      console.log('redis reconnecting');
   });

   redisCli.on('end', () => {
      console.info('redis disconnected');
   });

   await redisCli.connect();
}