import mongoose from "mongoose";

export async function connect(connectionString: string | undefined) {
  if (!connectionString) throw new Error("Invalid connection string");
  mongoose.connection.on("connected", function () {
    console.log("Mongoose default connection open ");
  });
  mongoose.connection.on("disconnected", function () {
    console.log("Mongoose connection closed ");
  });
  mongoose.connection.on("error", function (err) {
    console.log("Mongoose default connection error: " + err);
  });
  return await mongoose.connect(connectionString, { useNewUrlParser: true });
}

export async function drop() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.drop();
  }
}

export function populate() {}
