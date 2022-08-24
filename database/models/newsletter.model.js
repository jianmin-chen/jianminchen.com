import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
    {
        html: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.newsletter ||
    mongoose.model("newsletter", newsletterSchema);
