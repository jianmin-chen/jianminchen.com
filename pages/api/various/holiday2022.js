import Filter from "bad-words";
import Cors from "cors";
import mongoose from "mongoose";
import dbConnect from "../../../database/connect";

const filter = new Filter();
const cors = Cors({
    methods: ["GET", "POST", "HEAD"]
});
const Signature =
    mongoose.models.holiday2022 ||
    mongoose.model(
        "holiday2022",
        new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                unique: true
            }
        })
    );

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, result => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);

    const { method } = req;
    if (method === "GET") {
        // Get holiday card signatures
        try {
            await dbConnect();
        } catch {
            return res.status(500).json({
                success: false,
                reason: "Connection error"
            });
        }

        try {
            const signatures = await Signature.find();
            return res.status(200).json({
                success: true,
                signatures: signatures.map(signature => signature.name)
            });
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, reason: err.message });
        }
    } else if (method === "POST") {
        // Add a holiday card signature
        try {
            await dbConnect();
        } catch {
            return res.status(500).json({
                success: false,
                reason: "Connection error"
            });
        }

        const { name } = req.body;
        if (!name)
            return res
                .status(400)
                .json({ success: false, reason: "Name not provided" });

        try {
            const exists = await Signature.findOne({ name });
            if (exists)
                return res.status(409).json({
                    success: false,
                    error: "Hmm, looks like someone already added that name! Maybe use your full name?"
                });

            await Signature.create({ name: filter.clean(name) });
            return res.status(200).json({
                success: true
            });
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, reason: err.message });
        }
    } else
        return res.status(400).json({
            success: false,
            reason: "Invalid request method"
        });
}
