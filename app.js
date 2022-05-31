var express = require('express');
var path = require('path');

const port = process.env.port || 3000;

var app = express();

// gets rid of .html postfix need in url while serving pages
app.use(express.static(path.join(__dirname, 'public'), {extensions:['html']}));

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/e404.html');
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port: ${port}`);
});


module.exports = app;
