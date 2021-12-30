

const app = require('./qandaAPI.js');
const port = 4000;
app.listen(port, ()=>{
  console.log("Server listening at port:", port);
});

