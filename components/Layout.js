import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import hackclubWebring from "../public/assets/hackclub-webring.svg";

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

    const [before, setBefore] = useState({});
    const [after, setAfter] = useState({});
    useEffect(() => {
        // TODO: Import webring(s) here
        fetch("https://webring.hackclub.com/public/members.json")
            .then(res => res.json())
            .then(webring => {
                let siteIndex = 0;
                for (let i = 0; i < webring.length; i++) {
                    if (webring[i].url === "https://jianminchen.com") {
                        siteIndex = i;
                        break;
                    }
                }

                let previousIndex = siteIndex - 1;
                if (previousIndex === -1) previousIndex = webring.length - 1;
                setBefore({ ...before, hackClub: webring[previousIndex].url });

                let nextIndex = siteIndex + 1;
                if (nextIndex === webring.length) nextIndex = 0;
                setAfter({ ...after, hackClub: webring[nextIndex].url });
            });
    }, [before, after]);

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
                    <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                        {before.hackClub && after.hackClub && (
                            <>
                                <style>{`
                                    #hackclub-webring {
                                        display: flex;
                                        align-items: flex-start;
                                        gap: 4px;
                                    }

                                    #hackclub-webring a {
                                        color: rgba(132, 146, 166, 0.8);
                                        font-size: 28px;
                                        text-decoration: none;
                                        transition: color 0.5s;
                                    }
                                `}</style>
                                <div id="hackclub-webring">
                                    <a
                                        href={before.hackClub}
                                        id="previousBtn"
                                        title="Previous">
                                        ‹
                                    </a>
                                    <a
                                        href="https://webring.hackclub.com/"
                                        title="Hack Club Webring">
                                        <Image
                                            alt="Hack Club Webring"
                                            layout="fixed"
                                            width="36px"
                                            height="36px"
                                            src={hackclubWebring}
                                        />
                                    </a>
                                    <a
                                        href={after.hackClub}
                                        id="nextBtn"
                                        title="Next">
                                        ›
                                    </a>
                                </div>
                            </>
                        )}
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
