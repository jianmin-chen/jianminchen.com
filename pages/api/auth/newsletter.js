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
            try {
                await dbConnect();
            } catch {
                res.status(500).json({
                    success: false,
                    reason: "Couldn't connect to database. Try again?"
                });
            }

            // Get all newsletters
            try {
                return res.status(200).json({
                    success: true,
                    newsletters: await Email.getAllNewsletters()
                });
            } catch (err) {
                return res
                    .status(500)
                    .json({ success: false, reason: err.message });
            }
        } else if (method === "POST") {
            try {
                await dbConnect();
            } catch {
                return res.status(500).json({
                    success: false,
                    reason: "Couldn't connect to database. Try again?"
                });
            }

            // Send newsletter to users
            const { html, subject } = req.body;
            if (!html || !subject) {
                return res.status(400).json({
                    success: false,
                    reason: "Newsletter content or subject not provided. Try again?"
                });
            }

            try {
                await Email.email(html, subject);
                return res.status(200).json({ success: true });
            } catch (err) {
                return res
                    .status(500)
                    .json({ success: false, reason: err.message });
            }
        } else {
            return res.status(400).json({
                success: false,
                reason: "Invalid request method. Try again?"
            });
        }
    },
    {
        cookieName: config.AUTH_TOKEN,
        password: config.AUTH_PASSWORD,
        cookieOptions: {
            secure: config.NODE_ENV === "production"
        }
    }
);
