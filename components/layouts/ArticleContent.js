import { DiscussionEmbed } from "disqus-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { MDXRemote } from "next-mdx-remote";
import components from "../../utils/mdxComponents";
import "highlight.js/styles/base16/ashes.css";
import { useEffect } from "react";

export default function ArticleContent({
    source,
    date,
    excerpt,
    title,
    readingTime,
    category
}) {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>{`${title} | Jianmin Chen`}</title>

                <meta property="og:title" content={`${title} | Jianmin Chen`} />
                <meta property="og:description" content={excerpt} />
                <meta property="og:type" content="article" />

                <meta itemProp="name" content={`${title} | Jianmin Chen`} />
                <meta itemProp="description" content={excerpt} />

                <meta name="description" content={excerpt} />

                <meta
                    name="twitter:title"
                    content={`${title} | JIanmin Chen`}
                />
                <meta name="twitter:description" content={excerpt} />
            </Head>
            <Link href={`/articles/${category}`}>
                <a style={{ textDecoration: "none" }}>
                    <h3>&larr; Back to articles</h3>
                </a>
            </Link>
            <h1>{title}</h1>
            <p>
                <em>
                    {date} &middot; {readingTime}
                </em>
                <br />
            </p>
            <MDXRemote {...source} components={components} />
            <DiscussionEmbed
                shortname="jianminchen"
                config={{
                    url: `https://jianminchen.com/${router.asPath}`,
                    identifier: router.asPath,
                    title
                }}
            />
        </>
    );
}
