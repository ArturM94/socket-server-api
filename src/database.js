import mongoose, { connection } from 'mongoose';

/**
 * Connects to database.
 *
 * @param URI {string} Database URI
 * @returns {Promise<Connection>} MongoDB connection
 */
async function connectToDatabase (URI) {
  mongoose.Promise = await global.Promise;

  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  await connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

  return connection;
}

export { connectToDatabase };
