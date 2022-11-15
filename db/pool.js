var mongoose = require('mongoose');
var mainPool = mongoose.createConnection("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
var app = mainPool.useDb('certify');

module.exports = {
    app: () => app
};