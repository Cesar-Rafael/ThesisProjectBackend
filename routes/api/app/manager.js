module.exports = function(app) {
    /****************************** PORTAL WEB ********************************************/
    app.use('/api', require('../../../controllers/app/user'));
};