import { createClient } from 'redis';

export const client  = createClient({
url: 'redis://redis:6379'
});
client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err: any) => console.log('Redis Client Error', err));
