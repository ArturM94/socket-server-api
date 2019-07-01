import mongoose from 'mongoose';
import config from './config';

/**
 * Connects to database.
 *
 * @returns {Promise<void>}
 */
async function connectToDatabase () {
  const { URI } = config.db;

  mongoose.Promise = await global.Promise;

  if (process.env.NODE_ENV !== 'test') {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  const db = await mongoose.connection;
  await db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  console.log(`connected to db: ${URI}`);
}

export { connectToDatabase };
