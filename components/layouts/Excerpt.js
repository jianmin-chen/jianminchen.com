import { MDXRemote } from "next-mdx-remote";
import components from "../../utils/mdxComponents";
import "highlight.js/styles/base16/ashes.css";

export default function Excerpt({ source }) {
    return (
        <>
            <MDXRemote {...source} components={components} />
        </>
    );
}
