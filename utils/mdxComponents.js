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
    SplideSlide
};
