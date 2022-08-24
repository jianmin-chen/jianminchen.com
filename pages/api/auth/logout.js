import { withIronSessionApiRoute } from "iron-session/next";
import config from "../../../utils/config";

export default withIronSessionApiRoute(
    function handler(req, res) {
        const { method } = req;
        if (method != "GET")
            return res.status(400).json({
                success: false,
                reason: "Invalid request. Try logging out from the admin dashboard?"
            });

        // Only log out if logged in
        if (!req.session || !req.session.admin || !req.session.admin.signedin)
            return res.status(401).json({
                success: false,
                reason: "Looks like you're not logged in. Try again?"
            });

        req.session.destroy();
        res.writeHead(302, { location: "/" });
        return res.status(302).json({ success: true });
    },
    {
        cookieName: config.AUTH_TOKEN,
        password: config.AUTH_PASSWORD,
        cookieOptions: {
            secure: config.NODE_ENV === "production"
        }
    }
);
