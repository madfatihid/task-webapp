
const { User } = require('../models/user');

exports.get = async (req, res) => {

    const { email } = req.auth;
    
    if (!email) return res.sendStatus(406);

    const user = await User.findOne({
        attributes: ['username', 'email'],
        where: { email }
    });

    if (user === null) return res.sendStatus(406);

    return res.json(user);
};

exports.post = async (req, res) => {

    const { email } = req.auth;
    const { username } = req.body;

    if (!email || !username) return res.sendStatus(406);

    const user = await User.findOne({
        attributes: ['id', 'username', 'email'],
        where: { email }
    });

    if (user === null) return res.sendStatus(406);

    user.set({
        id: user.id,
        username
    });

    await user.save();

    return res.sendStatus(200);
};