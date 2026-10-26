const Movie = require('../models/Movie');

exports.getMovies = async (req, res, next) => {
  try {
    const { search, genre, language } = req.query;
    let query = { isActive: true };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (genre && genre !== 'All') query.genre = { $in: [genre] };
    if (language && language !== 'All') query.language = { $regex: new RegExp(`^${language}$`, 'i') };
    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (err) { next(err); }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (err) { next(err); }
};

exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (err) { next(err); }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted' });
  } catch (err) { next(err); }
};