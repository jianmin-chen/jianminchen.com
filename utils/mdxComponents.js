import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Head from "next/head";

const mdxComponents = {
    img: ({ src, alt }) => (
        <span className="image">
            <img alt={alt} src={src} />
            <em>{alt}</em>
        </span>
    ),
    Head,
    Splide,
    SplideSlide,
    EditNotice: () => (
        <blockquote>
            Hey! This is a post forever in progress. In other words, I'm
            probably going to tweak it once in a while, because things do
            change.
        </blockquote>
    ),
    Video: ({ className, src, alt, type = "mp4" }) => (
        <div className={`${className} image`}>
            <video controls style={{ width: "100%" }}>
                <source src={src} type={`video/${type}`} />
            </video>
            <em>{alt}</em>
        </div>
    )
};

export default mdxComponents;
