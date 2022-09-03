import mongoose from "mongoose";

const errorSchema = new mongoose.Schema(
    {
        error: {
            type: String,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.error || mongoose.model("error", errorSchema);
