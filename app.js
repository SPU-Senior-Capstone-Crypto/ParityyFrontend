var createError = require('http-errors');
var express = require('express');
var path = require('path');

const port = process.env.port || 3000;


var app = express();

app.use(express.static(path.join(__dirname, 'public'), {extensions:['html']}));

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port: ${port}`);
});


module.exports = app;
