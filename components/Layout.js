import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

export default function Layout({ menu, component }) {
    const [newsletterVisible, setNewsletterVisible] = useState(false);
    const newsletterProps = useSpring({
        display: newsletterVisible ? "flex" : "none"
    });
    const newsletterModalProps = useSpring({
        marginTop: newsletterVisible ? 0 : -500
    });

    const [subscribeMessage, setSubscribeMessage] = useState(null);
    useEffect(() => {
        if (newsletterVisible) setSubscribeMessage(null);
    }, [newsletterVisible]);
    const subscribe = async function (e) {
        e.preventDefault();

        const email = e.target.email.value;
        e.target.email.value = "";
        if (!email) {
            setSubscribeMessage({
                color: "red",
                message: "You'll need to enter your email."
            });
        }

        fetch("/api/subscribe", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(json => {
                if (!json.success) {
                    setSubscribeMessage({
                        color: "red",
                        message:
                            json.reason ||
                            "Huh. Looks like there was an error adding you to the newsletter. Try again?"
                    });
                } else {
                    setSubscribeMessage({
                        color: "green",
                        message: "Great. You're subscribed to the newsletter!"
                    });
                }
            })
            .catch(err =>
                setSubscribeMessage({
                    color: "red",
                    message:
                        "Huh. Looks like there was an error adding you to the newsletter. Try again?"
                })
            );
    };

    return (
        <>
            <animated.div
                id="newsletter"
                onClick={() => setNewsletterVisible(false)}
                style={newsletterProps}>
                <animated.div
                    id="newsletter-modal"
                    onClick={event => event.stopPropagation()}
                    style={newsletterModalProps}>
                    <p>
                        Get notified whenever I post a new article! Delivered
                        right to your inbox - no spam, guaranteed.
                    </p>
                    <form onSubmit={subscribe}>
                        <div className="form-input">
                            <input
                                autoComplete="off"
                                name="email"
                                type="email"
                                placeholder="Your email..."
                                required
                            />
                            <button type="submit">&rarr;</button>
                        </div>
                    </form>
                    {subscribeMessage ? (
                        <p style={{ color: subscribeMessage.color }}>
                            {subscribeMessage.message}
                        </p>
                    ) : (
                        ""
                    )}
                </animated.div>
            </animated.div>
            <div id="blog-wrapper">
                <div id="nav">
                    <Link href="/">
                        <a id="header">
                            <h1>Jianmin Chen</h1>
                        </a>
                    </Link>
                    <blockquote id="quote">
                        Just my thoughts on programming. Feel free to use
                        whatever you find here, as long as you include a link
                        back to the original location.
                    </blockquote>
                    <div id="links">
                        <Link href="/articles">
                            <a>Articles</a>
                        </Link>
                        {menu.map(item => (
                            <Link href={item.route} key={item.route}>
                                <a>{item.title}</a>
                            </Link>
                        ))}
                        <a onClick={() => setNewsletterVisible(true)}>
                            Newsletter
                        </a>
                    </div>
                    {/*
                        <div style={{ marginTop: "2rem" }}>
                            <iframe
                                src="https://overengineering.kognise.dev/embed/jianmin"
                                title="overengineeRING embed"
                                width="100%"
                                height="100"
                                style={{ userSelect: "none" }}
                                frameBorder="0"
                            />
                        </div>
                    */}
                    <div style={{ marginTop: "2rem" }}>
                        <div id="webring-wrapper">
                            <a
                                href="https://webring.hackclub.com/"
                                id="previousBtn"
                                className="webring-anchor"
                                title="Previous">
                                ‹
                            </a>
                            <a
                                href="https://webring.hackclub.com/"
                                className="webring-logo"
                                title="Hack Club Webring"
                                alt="Hack Club Webring"></a>
                            <a
                                href="https://webring.hackclub.com/"
                                id="nextBtn"
                                className="webring-anchor"
                                title="Next">
                                ›
                            </a>
                            <Script src="https://webring.hackclub.com/public/embed.min.js" />
                        </div>
                    </div>
                </div>
                <div id="blog">
                    <div className="other" />
                    <div className="content">{component}</div>
                </div>
            </div>
        </>
    );
}
