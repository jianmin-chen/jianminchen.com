// TODO: Figure out how to add image optimization in the future?

import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

export default async function convertMDX(content, disableAutolink = false) {
    let rehypePlugins;
    if (!disableAutolink)
        rehypePlugins = [
            rehypeSlug,
            rehypeAutolinkHeadings,
            rehypeHighlight,
            remarkGfm
        ];
    else rehypePlugins = [rehypeHighlight, remarkGfm];

    return await serialize(content, {
        mdxOptions: { rehypePlugins },
        parseFrontmatter: false
    });
}
