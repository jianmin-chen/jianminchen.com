import Head from "next/head";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />

                <meta property="og:author" content="Jianmin Chen" />
                <meta
                    property="og:image"
                    content="https://jianminchen.com/assets/site-screenshot.webp"
                />
                <meta property="og:site_name" content="Blog | Jianmin Chen" />

                <meta
                    itemProp="image"
                    content="https://jianminchen.com/assets/site-screenshot.webp"
                />

                <meta name="author" content="Jianmin Chen" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:image"
                    content="https://jianminchen.com/assets/site-screenshot.webp"
                />

                <meta
                    name="apple-mobile-web-app-title"
                    content="Blog | Jianmin Chen"
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
