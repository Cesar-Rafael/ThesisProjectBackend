const router = require('express').Router();
const USER = require('../../models/app/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.route('/register')
    .post(async(req, res) => {

        let response = { result: 'NOK' },
            body = req.body;

        try {

            if (await USER.findOne({ email: body.email })) {
                res.status(400);
                response.message = 'User alredy exits';
            } else {
                const salt = await bcrypt.genSalt(10);
                body.password = await bcrypt.hash(body.password, salt);

                const user = await USER.create(body);
                const { password, ...data } = await user.toJSON();

                response.content = data;
                response.result = 'OK';
            }

        } catch (e) {
            console.log(e);
        }

        res.json(response);
    });

router.route('/login')
    .post(async(req, res) => {

        let response = { result: 'NOK' },
            body = req.body;

        try {
            const user = await USER.findOne({ email: body.email });

            if (!user) {
                response.message = 'User not found';
                return res.status(404).json(response);
            }

            if (!await bcrypt.compare(body.password, user.password)) {
                response.message = 'Invalid Credentials';
                return res.status(400).json(response);
            }

            const token = jwt.sign({ _id: user._id }, "secret")

            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 12 * 60 * 60 * 1000 // 12 hours
            })

            response.message = 'Success';
            response.result = 'OK';

        } catch (e) {
            console.log(e);
        }

        res.json(response);

    });

router.route('/user')
    .get(async(req, res) => {

        let response = { result: 'NOK' };

        try {
            const cookie = req.cookies['jwt'];

            const claims = jwt.verify(cookie, 'secret');

            if (!claims) {
                response.message = 'Unauthenticated';
                return res.status(401).json(response);
            }

            const user = await USER.findOne({ _id: claims._id });

            const { password, ...data } = await user.toJSON();
            response.content = data;
            response.result = 'OK';


        } catch (e) {
            response.message = 'Unauthenticated';
            return res.status(401).json(response);
        }

        res.json(response);
    });

router.route('/logout')
    .post((req, res) => {

        let response = { result: 'NOK' };

        try {
            res.cookie('jwt', '', { maxAge: 0 });
            response.message = 'Success';
            response.result = 'OK';

        } catch (e) {
            console.log(e);
        }

        res.json(response);

    });

module.exports = router;