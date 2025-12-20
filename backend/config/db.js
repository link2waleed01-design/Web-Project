/**
 * Database Configuration
 * 
 * This file handles the MongoDB connection using Mongoose.
 * It exports a function that connects to the database and handles
 * connection errors gracefully.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * 
 * Uses the MONGODB_URI environment variable for the connection string.
 * Logs success or error messages to the console.
 * Exits the process if connection fails.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the error and exit process with failure code
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
