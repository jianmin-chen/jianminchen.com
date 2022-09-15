import mjml2html from "mjml";
import nodemailer from "nodemailer";
import Newsletter from "../models/newsletter.model";
import Subscriber from "../models/subscriber.model";
import config from "../../utils/config";

class EmailService {
    async addSubscriber(data) {
        return await Subscriber.create(data);
    }

    async getAllSubscribers() {
        const subscribers = await Subscriber.find();
        return subscribers.map(document => document.email);
    }

    async deleteSubscriber(email) {
        return await Subscriber.deleteOne({ email });
    }

    async getAllNewsletters() {
        const newsletters = await Newsletter.find();
        return newsletters
            .map(({ html, subject, createdAt }) => ({
                html,
                subject,
                date: createdAt
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    async email(html, subject) {
        if ((await Newsletter.find({ html })).length) {
            throw new Error("Newsletter already exists?");
        }

        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: config.EMAIL_USERNAME,
                pass: config.EMAIL_PASSWORD
            },
            secure: true
        });

        const emailTemplate = mjml2html({
            tagName: "mjml",
            attributes: {},
            children: [
                {
                    tagName: "mj-head",
                    attributes: {},
                    children: [
                        {
                            tagName: "mj-font",
                            attributes: {
                                name: "EB Garamond",
                                href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600"
                            }
                        }
                    ]
                },
                {
                    tagName: "mj-body",
                    attributes: {},
                    children: [
                        {
                            tagName: "mj-section",
                            attributes: {
                                "full-width": "full-width",
                                "border": "1px"
                            },
                            children: [
                                {
                                    tagName: "mj-column",
                                    attributes: {},
                                    children: [
                                        {
                                            tagName: "mj-text",
                                            attributes: {
                                                "font-family": "EB Garamond",
                                                "font-size": "24px",
                                                "line-height": "1.6"
                                            },
                                            content: `
                                            <p>Hi there!</p>
                                            <p>You're receiving this because you signed up for my newsletter at <a href="https://jianminchen.com">jianminchen.com</a>.</p>
                                            ${html.replace(
                                                "<img",
                                                "<img style='border-radius: 15px; margin-top: 10px; width: 100%;'"
                                            )}
                                            <p>That's all,</p>
                                            `
                                        },
                                        {
                                            tagName: "mj-image",
                                            attributes: {
                                                "align": "left",
                                                "src": "https://jianminchen.com/assets/signature.png",
                                                "padding-bottom": "30px",
                                                "width": "200px"
                                            }
                                        },
                                        {
                                            tagName: "mj-divider",
                                            attributes: {}
                                        },
                                        {
                                            tagName: "mj-text",
                                            attributes: {
                                                "align": "center",
                                                "font-family": "EB Garamond",
                                                "font-size": "18px",
                                                "line-height": 1.6
                                            },
                                            content:
                                                "Looking to unsubscribe? Just reply to this email."
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }).html;

        let mailData = {
            from: config.EMAIL_SENDER,
            bcc: [],
            subject,
            html: emailTemplate
        };

        const subscribers = await this.getAllSubscribers();
        subscribers.map(email => mailData.bcc.push(email));

        await transporter.sendMail(mailData);

        // Store newsletter in database
        await Newsletter.create({ html, subject });
        return true;
    }
}

export default new EmailService();
