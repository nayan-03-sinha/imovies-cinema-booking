const Theatre = require('../models/Theatre');

exports.getTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find();
    res.json({ success: true, data: theatres });
  } catch (err) { next(err); }
};

exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({ success: true, data: theatre });
  } catch (err) { next(err); }
};

exports.deleteTheatre = async (req, res, next) => {
  try {
    await Theatre.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Theatre deleted' });
  } catch (err) { next(err); }
};