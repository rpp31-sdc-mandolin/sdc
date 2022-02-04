const { createClient }  = require('redis');
const rport = 6379;
const rhost = "localhost"
async function writeCache(skey,sval) {
  var client = createClient(rport,rhost);
  /*client.on('connect', function() {
    console.log('Redis client connected');
  });
  client.on('error', function (err) {
    console.log('Something went wrong ' + err);
  });*/
  await client.connect();

 await client.set('key', 'value');
  //client.unref();
  client.set(skey, sval);
  client.quit();

}
async function getCache(skey) {

    var client = createClient(rport,rhost);
    await client.connect();
  //client.unref();
   var value =  await client.get(skey);
  client.quit();
  return value;



}

writeCache('key','value');
console.log(getCache('key'));

var testFunction = function() {
  return new Promise((resolve,reject) =>{
    resolve(1)
  });
}

testFunction()
.then((value) => {
  return  new Error ("value is 1");
})
.then((value) => {
  return value;
})
.catch((error) => {
  console.log(error);
})
/*(async () => {
  const client = createClient();

  /*client.on('connect', function() {
    console.log('Redis client connected');
  });
  client.on('error', function (err) {
    console.log('Something went wrong ' + err);
  });*/

 /*await client.connect();

 await client.set('key', 'value');
  console.log('set...\n');
  var value = await client.get('key');
  console.log('got ' + value);
  await client.del('key');
  value = await client.get('key');
  console.log('got Again' + value);
  client.quit();

})();*/

