require('dotenv').config();
const mongoose = require('mongoose');

const dataConnect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://fullafridhi:13mai2024@cluster0.zm3xz6u.mongodb.net/projectpfe?retryWrites=true&w=majority';

  try {
    await mongoose.connect(uri);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = dataConnect;
