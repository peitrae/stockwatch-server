import mongoose from 'mongoose';

const removeAllCollections = async () => {
	const collections = Object.keys(mongoose.connection.collections);

	for (const name of collections) {
		const collection = mongoose.connection.collections[name];

		await collection.deleteMany({});
	}
};

const dropAllCollections = async () => {
	const collections = Object.keys(mongoose.connection.collections);

	for (const name of collections) {
		const collection = mongoose.connection.collections[name];

		try {
			await collection.drop();
		} catch (err) {
			// Sometimes this error happens, but you can safely ignore it

			if (err.message === 'ns not found') {
				return;
			} // This error occurs when you use it.todo. You can safely ignore this error too

			if (err.message.includes('a background operation is currently running')) {
				return console.log(err.message);
			}
		}
	}
};

function setup(dbName: string) {
	// Create connection to the db
	beforeAll(async () => {
		const url = `mongodb://127.0.0.1:27017/${dbName}`;
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});
	});

	// Cleans up database between each test
	afterEach(async () => {
		await removeAllCollections();
	});

	// Disconnect Mongoose
	afterAll(async () => {
		await dropAllCollections();
		await mongoose.connection.close();
	});
}

export default setup;
