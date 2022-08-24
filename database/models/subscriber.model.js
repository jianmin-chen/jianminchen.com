import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
        validate: [
            function () {
                const matchesRegex = this.email
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );

                if (!matchesRegex) return false;
                return true;
            },
            "Invalid email"
        ]
    }
});

export default mongoose.models.subscriber ||
    mongoose.model("subscriber", subscriberSchema);
