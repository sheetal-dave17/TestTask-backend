const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../models');

// create user entry/registration
exports.register = async (req, res) => {
    try {
        const userParam = req.body;
        if (await User.findOne({ username: userParam.username })) {
            return res.status(400).json(
                {
                    status: 'error',
                    message: `Username [${userParam.username}] is already taken`
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
   const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret,
            { expiresIn: '7d' });
        return res.status(200).json(
            {
                status: 'success',
                token: token
            });
    }
};