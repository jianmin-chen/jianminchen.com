import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import components from "../../utils/mdxComponents";
import "highlight.js/styles/base16/ashes.css";

export default function Content({ metadata, metadataExcerpt, source, title }) {
    return (
        <>
            {!metadata && (
                <Head>
                    <title>{`${title} | Jianmin Chen`}</title>

                    <meta
                        property="og:title"
                        content={`${title} | Jianmin Chen`}
                    />
                    <meta property="og:description" content={metadataExcerpt} />
                    <meta property="og:type" content="article" />

                    <meta itemProp="name" content={`${title} | Jianmin Chen`} />
                    <meta itemProp="description" content={metadataExcerpt} />

                    <meta name="description" content={metadataExcerpt} />

                    <meta
                        name="twitter:title"
                        content={`${title} | Jianmin Chen`}
                    />
                    <meta
                        name="twitter:description"
                        content={metadataExcerpt}
                    />
                </Head>
            )}
            <h1>{title}</h1>
            <MDXRemote {...source} components={components} />
        </>
    );
}
