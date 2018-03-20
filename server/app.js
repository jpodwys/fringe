var express = require('express'),
  compress = require('compression'),
  forceSsl = require('force-ssl-heroku'),
  app = express(),
  PORT = process.env.PORT || 4000;

app.disable('x-powered-by');
app.use(forceSsl);
app.use(compress({threshold: '1.4kb'}));
app.use(express.static('dist', {maxAge: '30d'}));
// require('./middleware/app-middleware')(app);
require('./routes')(app);

var server = app.listen(PORT);
