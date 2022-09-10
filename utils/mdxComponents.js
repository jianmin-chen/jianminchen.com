import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Head from "next/head";

export default {
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
            Hey! This is an article forever in progress. In other words, I'm
            probably going to tweak it once in a while, because things do
            change.
        </blockquote>
    ),
    Video: ({ src, alt, width = "50%", type = "mp4" }) => (
        <div className="image" style={{ width }}>
            <video controls style={{ width: "100%" }}>
                <source src={src} type={`video/${type}`} />
            </video>
            <em>{alt}</em>
        </div>
    )
};
