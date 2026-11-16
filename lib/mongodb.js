import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

/** True when a MongoDB connection string is configured. */
export const hasDatabase = Boolean(uri);

// Cache the connection across hot reloads and serverless invocations.
let cached = globalThis.__mongoose;
if (!cached) cached = globalThis.__mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (!uri) {
    const err = new Error("MONGODB_URI is not configured");
    err.code = "NO_DATABASE";
    throw err;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .then((m) => m)
      .catch((e) => {
        cached.promise = null;
        throw e;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
