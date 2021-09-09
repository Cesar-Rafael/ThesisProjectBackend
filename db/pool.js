var mongoose = require('mongoose');
var mainPool = mongoose.createConnection("mongodb://admin-cesar:admin123456@34.125.125.78:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");
var app = mainPool.useDb('app');

module.exports = {
    app: () => app
};