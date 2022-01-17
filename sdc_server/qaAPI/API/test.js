const { createClient }  = require('redis');

(async () => {
  const client = createClient();

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  await client.set('key', 'value');
  console.log('set...\n');
  const value = await client.get('key');
  console.log('got ' + value);
})();

