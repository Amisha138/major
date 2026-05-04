const mongoose = require("mongoose");

let memoryServer;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    return;
  }

  const { MongoMemoryServer } = require("mongodb-memory-server");

  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: "bookweb",
    },
  });

  await mongoose.connect(memoryServer.getUri());
  console.log("MongoDB connected (in-memory)");
};

module.exports = connectDB;
