import dbConnect from "../../database/connect";
import Email from "../../database/services/email.service";

export default async function handler(req, res) {
    const { method } = req;
    if (method != "POST")
        return res.status(400).json({
            success: false,
            reason: "Invalid request method. Try subscribing via the blog?"
        });

    try {
        await dbConnect();
    } catch {
        return res.status(500).json({
            success: false,
            reason: "Couldn't connect to the subscriber list. Try again?"
        });
    }

    // Add user to list of subscribers
    const { email } = req.body;
    if (!email) {
        return res
            .status(400)
            .json({ success: false, reason: "Email not provided. Try again?" });
    }

    try {
        await Email.addSubscriber({ email });
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        if (err.name === "ValidationError" || err.name == "MongoServerError")
            return res
                .status(400)
                .json({ success: false, reason: "Invalid email. Try again?" });
        return res.status(500).json({ success: false, reason: err.message });
    }
}
