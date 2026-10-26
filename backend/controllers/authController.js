const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026_xyz', { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'User already exists' });
    const user = await User.create({ name, email, password, phone, role: role === 'admin' ? 'admin' : 'user' });
    res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) } });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: await User.findById(req.user._id) });
  } catch (err) { next(err); }
};