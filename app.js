const express = require('express');
const bodyParser = require('body-parser');
const routers = require('./routes/routers');
const app = express();

require('./config/db-config');

//Middlewares to read body sent as request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes middelware
app.use('/api', routers);

app.listen('8080', () => {
  console.log('Listening at port 8080');
});
