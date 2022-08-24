import { generateArticleSlugs } from "../generate";

function generateSitemap(slugs) {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schema/sitemap/0.9">
            <url>
                <loc>https://jianminchen.com</loc>
            </url>
            ${slugs.map(
                slug => `
                    <url>
                        <loc>https://jianminchen.com/article/${slug}</loc>
                    </url>
                `
            )}
        </urlset>
    `;
}

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
    const slugs = await generateArticleSlugs();
    const sitemap = generateSitemap(slugs.flat());

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return { props: {} };
}
