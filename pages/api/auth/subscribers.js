import { withIronSessionApiRoute } from "iron-session/next";
import config from "../../../utils/config";
import dbConnect from "../../../database/connect";
import Email from "../../../database/services/email.service";

export default withIronSessionApiRoute(
    async function handler(req, res) {
        if (!req.session || !req.session.admin || !req.session.admin.signedin)
            return res.status(401).json({
                success: false,
                reason: "Looks like you're not logged in. Try again?"
            });

        const { method } = req;
        if (method === "GET") {
            // Get all subscribers
            try {
                await dbConnect();
            } catch {
                return res.status(500).json({
                    success: false,
                    reason: "Couldn't connect to database. Try again?"
                });
            }

            try {
                const subscribers = await Email.getAllSubscribers();
                return res.status(200).json({
                    success: true,
                    subscribers
                });
            } catch (err) {
                return res
                    .status(500)
                    .json({ success: false, reason: err.message });
            }
        } else if (method === "DELETE") {
            // Delete subscriber
            try {
                await dbConnect();
            } catch {
                return res.status(500).json({
                    success: false,
                    reason: "Couldn't connect to database. Try again?"
                });
            }

            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    reason: "Email not provided. Try again?"
                });
            }

            try {
                await Email.deleteSubscriber(email);
                return res.status(200).json({ success: true });
            } catch (err) {
                return res
                    .status(500)
                    .json({ success: false, reason: err.message });
            }
        }

        // Invalid method
        return res.status(400).json({
            success: false,
            reason: "Invalid request method. Try managing subscribers via the admin panel?"
        });
    },
    {
        cookieName: config.AUTH_TOKEN,
        password: config.AUTH_PASSWORD,
        cookieOptions: {
            secure: config.NODE_ENV === "production"
        }
    }
);
