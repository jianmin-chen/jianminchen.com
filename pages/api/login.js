import { withIronSessionApiRoute } from "iron-session/next";
import dbConnect from "../../database/connect";
import Admin from "../../database/services/admin.service";
import config from "../../utils/config";

export default withIronSessionApiRoute(
    async function handler(req, res) {
        if (req.session && req.session.admin && req.session.admin.signedin)
            return res.status(200).json({
                success: true,
                message: "Already logged in"
            });

        const { method } = req;
        if (method != "POST")
            return res.status(400).json({
                success: false,
                message:
                    "Invalid request method. Try logging in through the login page?"
            });

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                reason: "Username and password weren't provided. Try again?"
            });
        }

        try {
            await dbConnect();

            const match = await Admin.validate(username, password);
            if (!match) {
                return res.status(401).json({
                    success: false,
                    reason: "Invalid password. Try again?"
                });
            }

            req.session.admin = { signedin: true };
            await req.session.save();
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(401).json({
                success: false,
                reason: "Invalid login attempt. Try again?"
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
