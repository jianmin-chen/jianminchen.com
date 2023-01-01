import dayjs from "dayjs";
import FastGlob from "fast-glob";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";
import order from "./_content/_articles/order.js";
import config from "./utils/config";

const ARTICLE_PATH = config.BLOG_ARTICLE_PATH;
const MENU_PATH = config.BLOG_MENU_PATH;

const readdir = dir =>
    fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

export async function generateArticleSlugs() {
    const categories = readdir(ARTICLE_PATH);
    return Promise.all(
        categories.map(async category => {
            // Go through each category folder in directory
            const categoryPath = path
                .join(ARTICLE_PATH, category)
                .replace(/\\/g, "/"); // Replace forward slashes on Windows with back slashes

            const articlePaths = FastGlob.sync(`${categoryPath}/*.mdx`);
            const articles = articlePaths
                .map(path => {
                    // Go through each MDX article in category directory
                    const pathContent = path.split("/");
                    const fileName = pathContent
                        .slice(pathContent.length - 2)
                        .join("/");
                    const [slug, _extension] = fileName.split(".");
                    return slug;
                })
                .filter(async slug => {
                    // Filter out drafts in production mode
                    const article = await getArticleFromSlug(slug);
                    if (
                        article.frontmatter.draft &&
                        config.NODE_ENV === "production"
                    )
                        return false;
                    return true;
                });
            return Promise.all(articles);
        })
    );
}

export async function getArticleFromSlug(slug) {
    const articleDir = path.join(ARTICLE_PATH, `${slug}.mdx`);
    const source = fs.readFileSync(articleDir);
    const { content, data } = matter(source);

    let excerpt = "No excerpt provided.";
    let nlnl = content.trim().indexOf("\n\n");
    if (nlnl !== -1) {
        excerpt = `${content.slice(0, nlnl)}...`;
    }

    return {
        content,
        frontmatter: {
            ...data,
            slug: slug,
            readingTime: readingTime(source).text,
            excerpt,
            date: dayjs(data.date.toString()).format("YYYY-MM-DD")
        }
    };
}

export async function generateArticles(category) {
    const articles = fs.readdirSync(path.join(ARTICLE_PATH, category));

    if (articles.filter(article => article == ".gitkeep").length) return []; // No articles yet
    return articles.filter(article => !article.endsWith(".swp")).flatMap(currPath => {
        const slug = `${category}/${currPath.replace(".mdx", "")}`;
        const source = fs.readFileSync(
            path.join(ARTICLE_PATH, category, currPath)
        );
        const { content, data } = matter(source);

        if (data.draft && config.NODE_ENV === "production") return []; // Filter out drafts in production mode

        let excerpt = "";
        let nlnl = content.trim().indexOf("\n\n");
        if (nlnl !== -1) {
            excerpt = `${content.slice(0, nlnl)}...`;
        }

        return {
            ...data,
            slug: slug,
            readingTime: readingTime(source).text,
            excerpt,
            date: dayjs(data.date.toString()).format("YYYY-MM-D")
        };
    });
}

export async function generateCategories() {
    return order;
}

export async function generateMenu() {
    const items = fs.readdirSync(MENU_PATH);
    return Promise.all(
        items.map(async currPath => {
            const source = fs.readFileSync(path.join(MENU_PATH, currPath));
            const { content, data } = matter(source);

            let excerpt = "No excerpt provided.";
            let nlnl = content.trim().indexOf("\n\n");
            if (nlnl !== -1) {
                excerpt = `${content.slice(0, nlnl)}...`;
            }

            return {
                ...data,
                content,
                excerpt
            };
        })
    );
}

export async function getItemFromRoute(route) {
    const menu = await generateMenu();
    for (let item of menu) {
        if (item.route === route) {
            return item;
        }
    }
}
