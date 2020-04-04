/* eslint-disable strict */
let express = require('express'),
    path = require('path'),
    consolidate = require('consolidate');

let app = express();
let port = 3000;

app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './views'));

app.use(express.json());

//require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require('./routes')(app);

// Configure express application to use passportjs

app.listen(port, function () {
    console.log('App (production) is now running on port 3000!');
});
module.exports = app;