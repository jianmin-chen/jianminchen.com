import ArticleContent from "../../../components/layouts/ArticleContent";
import Layout from "../../../components/Layout";
import convertMDX from "../../../utils/serialize";
import {
    generateArticleSlugs,
    getArticleFromSlug,
    generateMenu
} from "../../../generate";

export default function Article({ menu, content, frontmatter, category }) {
    return (
        <Layout
            menu={menu}
            component={
                <ArticleContent
                    source={content}
                    category={category}
                    {...frontmatter}
                />
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

    const { category, slug } = context.params;
    let { content, frontmatter } = await getArticleFromSlug(
        `${category}/${slug}`
    );
    content = await convertMDX(content);

    return {
        props: {
            menu,
            content,
            frontmatter,
            category
        }
    };
}

export async function getStaticPaths() {
    const slugs = await generateArticleSlugs();

    const formatted = slugs.flat().map(slug => {
        const slugDir = slug.split("/");
        return { params: { category: slugDir[0], slug: slugDir[1] } };
    });

    return {
        paths: formatted,
        fallback: false
    };
}
