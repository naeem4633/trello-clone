const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    console.log('MongoDB connected');

    const adminDB = mongoose.connection.db.admin();
    const databases = await adminDB.listDatabases();
    const existingDB = databases.databases.find(db => db.name === 'Trello-Clone-Database');

    if (!existingDB) {
      await mongoose.connection.db.createCollection('Trello-Clone-Database');
      console.log('Trello-Clone-Database created');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;