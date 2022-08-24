import Head from "next/head";
import Link from "next/link";
import convertMDX from "../../utils/serialize";
import Excerpt from "../../components/layouts/Excerpt";
import Layout from "../../components/Layout";
import Tabs from "../../components/articles/Tabs";
import {
    generateArticles,
    generateCategories,
    generateMenu
} from "../../generate";

export default function Articles({ menu, active, categories, articles }) {
    return (
        <Layout
            menu={menu}
            component={
                <>
                    <Head>
                        <title>
                            {`${
                                active.charAt(0).toUpperCase() + active.slice(1)
                            } | Jianmin Chen`}
                        </title>

                        <meta
                            property="og:title"
                            content={`Articles tagged #${active} | Jianmin Chen`}
                        />
                        <meta
                            property="og:description"
                            content={`All the articles I've written tagged #${active}!`}
                        />
                        <meta property="og:type" content="website" />

                        <meta
                            itemProp="name"
                            content={`Articles tagged #${active} | Jianmin Chen`}
                        />
                        <meta
                            itemProp="description"
                            content={`All the articles I've written tagged #${active}!`}
                        />

                        <meta
                            name="description"
                            content={`All the articles I've written tagged #${active}!`}
                        />

                        <meta
                            name="twitter:title"
                            content={`Articles tagged #${active} | Jianmin Chen`}
                        />
                        <meta
                            name="twitter:description"
                            content={`All the articles I've written tagged #${active}!`}
                        />
                    </Head>
                    <Tabs active={active} categories={categories} />
                    {articles.length ? (
                        articles.map(article => (
                            <div key={article.slug}>
                                <Link href={`/article/${article.slug}`}>
                                    <a style={{ textDecoration: "none" }}>
                                        <h1>{article.title}</h1>
                                    </a>
                                </Link>
                                <p>
                                    <em>
                                        {article.pinned ? (
                                            <span>Pinned &middot; </span>
                                        ) : (
                                            ""
                                        )}
                                        {article.date} &middot;{" "}
                                        {article.readingTime}
                                    </em>
                                    <br />
                                </p>
                                <Excerpt source={article.excerpt} />
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: "center" }}>
                            <i>
                                No articles yet! Subscribe to see when I write
                                something new.
                            </i>
                        </p>
                    )}
                </>
            }
        />
    );
}

export async function getStaticProps(context) {
    let menu = await generateMenu();
    menu = menu.map(item => {
        return {
            route: item.route,
            title: item.title
        };
    });

    const categories = await generateCategories();

    const { category } = context.params;

    let articles = await generateArticles(category);
    articles = articles
        .sort((a, b) => {
            if (a.pinned === b.pinned) return a.date - b.date;
            else if (a.pinned) return 1;
            else return -1;
        })
        .reverse();

    for (let item of articles) {
        // Convert excerpts to MDX
        item.excerpt = await convertMDX(item.excerpt, true);
    }

    return {
        props: {
            menu,
            active: category,
            categories,
            articles
        }
    };
}

export async function getStaticPaths() {
    const categories = await generateCategories();
    const formatted = categories.map(category => {
        return { params: { category } };
    });

    return {
        paths: formatted,
        fallback: false
    };
}
