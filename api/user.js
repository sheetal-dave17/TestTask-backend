const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../models');

// create user entry/registration
exports.register = async (req, res) => {
    try {
        const userParam = req.  body;
        if (await User.findOne({ email: userParam.email })) {
            return res.status(400).json(
                {
                    status: 'error',
                    message: `Email [${userParam.email}] is already taken`
                });
        }

        // hash password
        if (userParam.password) {
            userParam.hash = bcrypt.hashSync(userParam.password, 10);
        }
        const user = new User(userParam);

        // save user
        const response = await user.save();
        return res.status(201).json(
            {
                status: 'success',
                message: 'User created successfully',
                user: response
            });
    } catch (error) {
        return res.status(500).json(
            {
                status: 'error',
                error: error,
                message: 'something went wrong' });
    }
};

// login/authenticate user
exports.login = async (req, res) => {
   const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json(
            {
                status: 'error',
                message: `User does not exists in the system with email [${email}]`
            });

    }
    else if (bcrypt.compareSync(password, user.hash)) {
       let userData = {};
        Object.assign(userData, user.toJSON());
        const token = jwt.sign({ sub: user.id }, config.secret,
            { expiresIn: '7d' });
        userData.token = token;
        return res.status(200).json(
            {
                status: 'success',
                user: userData
            });
    }
    else {
        return res.status(400).json(
            {
                status: 'error',
                message: 'Either email or password is incorrect'
            });
    }
};

// update user profile data
exports.updateProfileData = async (req, res) => {
    try {
        const userParam = req.body;
        const fileName = req.file.filename + '.' + (req.file.mimetype).split('/')[1];
        userParam.profile = fileName;
        req.file.path = 'uploads\\' + fileName;
        let user = await User.findOne({ email: userParam.email });
        Object.assign(user, userParam);
        // save user
        const response = await user.save();
        return res.status(200).json(
            {
                status: 'success',
                message: 'Profile data updated successfully',
                user: response
            });
    } catch (error) {
        return res.status(500).json(
            {
                status: 'error',
                error: error,
                message: 'something went wrong' });
    }
};
