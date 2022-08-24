import mongoose from "mongoose";
import config from "../utils/config";

const MONGODB_URI = config.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, { bufferCommands: false })
            .then(connection => connection);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connect;
