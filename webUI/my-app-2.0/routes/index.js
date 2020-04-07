/* eslint-disable strict */
let bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', require('./homepage'));
    app.use('/cdc', require('./cdc'));
    app.use('/person', require('./person'));
    app.use('/hospital',require('./hospital'));

};