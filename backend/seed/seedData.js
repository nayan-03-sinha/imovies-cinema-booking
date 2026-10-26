const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies_db');
    console.log('[Seed] Connected to database');

    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Seat.deleteMany({});

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    await User.create({ name: 'System Admin', email: 'admin@imovies.com', password: adminPassword, role: 'admin' });
    await User.create({ name: 'John Doe', email: 'john@example.com', password: userPassword, role: 'user' });

    const theatres = await Theatre.insertMany([
      { name: 'PVR INOX: Phoenix Palladium', city: 'Mumbai', location: 'Lower Parel', address: 'Senapati Bapat Marg' },
      { name: 'Cinepolis: Nexus Seawoods', city: 'Navi Mumbai', location: 'Grand Central', address: 'Sector 40' }
    ]);

    const movies = await Movie.insertMany([
      {
        title: 'Interstellar: The Final Frontier',
        description: 'A team of explorers travel through a wormhole in space to ensure humanity survival.',
        genre: ['Sci-Fi', 'Adventure'],
        language: 'English',
        duration: 169,
        releaseDate: new Date(),
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
        rating: 8.9,
        certificate: 'UA'
      },
      {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology...",
        genre: ["Sci-Fi", "Action"],
        language: 'English',
        duration: 148,
        releaseDate: new Date(),
        posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80",
        rating: 8.8,
        certificate: 'UA'
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: ["Sci-Fi", "Adventure"],
        language: 'English',
        duration: 169,
        releaseDate: new Date(),
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
        rating: 8.7,
        certificate: 'UA'
      },
      {
        title: 'Cyberpunk Odyssey',
        description: 'In a dystopian neon megacity, a detective uncovers a rogue AI conspiracy.',
        genre: ['Action', 'Sci-Fi'],
        language: 'English',
        duration: 142,
        releaseDate: new Date(),
        posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
        rating: 8.5,
        certificate: 'A'
      }
    ]);

    const today = new Date().toISOString().split('T')[0];
    for (let theatre of theatres) {
      for (let movie of movies) {
        const show = await Show.create({
          movie: movie._id,
          theatre: theatre._id,
          screenName: 'Screen 1',
          showDate: today,
          showTime: '06:30 PM',
          tierPricing: { Silver: 150, Gold: 220, Platinum: 350 }
        });

        const rows = [
          { row: 'A', tier: 'Silver', price: 150 },
          { row: 'B', tier: 'Silver', price: 150 },
          { row: 'C', tier: 'Gold', price: 220 },
          { row: 'D', tier: 'Gold', price: 220 },
          { row: 'E', tier: 'Platinum', price: 350 },
          { row: 'F', tier: 'Platinum', price: 350 }
        ];

        const seats = [];
        rows.forEach(r => {
          for (let i = 1; i <= 10; i++) {
            seats.push({ show: show._id, seatNumber: `${r.row}${i}`, row: r.row, col: i, tier: r.tier, price: r.price, status: 'available' });
          }
        });
        await Seat.insertMany(seats);
      }
    }

    console.log('[Seed] Database populated successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();