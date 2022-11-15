module.exports = function (app) {
    /****************************** PORTAL WEB ********************************************/
    app.use('/authentication', require('../controllers/app/authentication'))
    app.use('/member', require('../controllers/app/member'))
    app.use('/student', require('../controllers/app/student'))
    app.use('/certificate', require('../controllers/app/certificate'))
}