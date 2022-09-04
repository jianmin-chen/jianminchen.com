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
    metadataExcerpt,
    title,
    readingTime,
    category
}) {
    const router = useRouter();

    console.log(metadataExcerpt);

    return (
        <>
            <Head>
                <title>{`${title} | Jianmin Chen`}</title>

                <meta property="og:title" content={`${title} | Jianmin Chen`} />
                <meta property="og:description" content={metadataExcerpt} />
                <meta property="og:type" content="article" />

                <meta itemProp="name" content={`${title} | Jianmin Chen`} />
                <meta itemProp="description" content={metadataExcerpt} />

                <meta name="description" content={metadataExcerpt} />

                <meta
                    name="twitter:title"
                    content={`${title} | JIanmin Chen`}
                />
                <meta name="twitter:description" content={metadataExcerpt} />
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
