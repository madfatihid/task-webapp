
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../models/user');

const saltRounds = 10;
const accessTokenExpire = '10m';

function generateAccessToken(req, res, email) {
    // access token for accessing profile
    const accessToken = jwt.sign({
        email,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: accessTokenExpire
    });

    // refresh token for refreshing access token if access token becomes expired
    const refreshToken = jwt.sign({
        email
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        // only allow from the same site
        sameSite: 'Strict', 
        // prevent cookie from being seen from the others
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 //1 day
    });
    return res.json({ accessToken }).status(201);
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({
            message: "Undefined",
        }).status(406);
    }

    const user = await User.findOne({ where: { email } });

    // send same error message to prevent attacker from guessing account
    if (user === null) {
        return res.send({
            message: "Email or password is incorrect",
        }).status(406);
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.send({
            message: "Email or password is incorrect",
        }).status(406);
    }

    return generateAccessToken(req, res, email);
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send({
            message: "Undefined",
        }).status(406);
    }

    // prevent user from using weak password and mitigate brute force attack
    if(!(/^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,32}$/).test(password)){
        return res.send({
            message: "Password not strong enough",
        }).status(406);
    }

    // mitigate brute force attack in case of database compromization
    const hash = bcrypt.hashSync(password, saltRounds);

    try {
        await User.create({ username, email, password: hash });
    } catch (e) {
        // reject if email already exists
        if (e.original.code === "ER_DUP_ENTRY") {
            return res.send({
                message: "Email already exists",
            }).status(406);
        }
        return res.sendStatus(406);
    }

    return generateAccessToken(req, res, email);
};

exports.refresh = (req, res) => {
    if (!req.cookies?.jwt)
        return res.status(406).json({ message: 'Unauthorized' });
    const refreshToken = req.cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log("decoded", decoded);
            if (err)
                return res.status(406).json({ message: 'Unauthorized' });

            const accessToken = jwt.sign({
                email: decoded.email,
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: accessTokenExpire
            });
            return res.json({ accessToken });
        })
};


exports.logout = (req, res) => {
    if (!req.cookies?.jwt)
        return res.status(406).json({ message: 'Unauthorized' });

    res.clearCookie("jwt");
    return res.sendStatus(200);
};