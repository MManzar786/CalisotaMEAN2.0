const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');
const ResetCode = mongoose.model('ResetCode');

const twilio = require('./twilio_sms.controller');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.city = req.body.city;
    user.phone = req.body.phone;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email','city','phone']) });
        }
    );
}

// If user account is found, generate and send the recovery code
module.exports.recover = (req, res) => {
    User.findOne({ email: req.body.email },
        (err, user) => {
            if (!user || err) {
                return res.status(404).json({ status: false, message: 'No account found with given username.' });
            } else {
                // generate reset code with expiry time, save to DB
                const randCode = Math.round((Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6))).toString(36).slice(1); // random 6 alpha-numeric digit code
                let expiresOnTime = new Date();
                expiresOnTime.setHours(expiresOnTime.getHours()+1);  // add 1 hour expiry time

                let resetCode = new ResetCode();
                resetCode.code = randCode;
                resetCode.expiresOn = expiresOnTime;
                resetCode.phone = user.phone;
                resetCode.userId = user._id;
                resetCode.save((err, doc) => {
                    if (err) {
                        return res.status(500).send({
                            status: false,
                            message: 'Error sending reset code.'
                        });
                    } else {
                        // send password reset code via twillio
                        twilio.sendSms(user.phone, `Your recovery code is ${doc.code}`)
                        .then(res => {
                            return res.status(200).send({
                                status: true,
                                message: 'Reset code sent successfully.'
                            });
                        })
                        .catch(err => {
                            return res.status(400).send({
                                status: false,
                                message: err
                            });
                        });
                    }
                });
            }
        }
    );
};

// verify reset code and send jwt token
module.exports.verifyResetCode = (req, res) => {
    ResetCode.findOne({
        code: req.body.code,
        expiresOn: {$gt: Date.now()}
    }, (err, resetCode) => {
        if (err || !resetCode) {
            return res.status(404).json({ status: false, message: `Reset code isn't valid or expired.` });
        } else {
            // generate and send jwt, jwt will be used to verify resetPassword call
            User.findOne({ _id: req._id }, (err, user) => {
                if (err || !user) {
                    return res.status(404).json({ status: false, message: `No user found associated with this reset code.` });
                } else {
                    return res.status(200).send({
                        status: true,
                        token: user.generateJwt()
                    });
                }
            });
        }
    });
};

// update user's password with the new one
// this request is verified before this controller is called
module.exports.resetPassword = (req, res) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else {
                user.password = req.body.newPassword;
                user.save((err, doc) => {
                    if (err) {
                        return res.status(500).send({
                            status: false,
                            message: ''
                        })
                    } else {
                        return res.status(200).json({ status: true, user : _.pick(user,['fullName','email','city','phone']) });
                    }
                });
            }
        }
    );
};
