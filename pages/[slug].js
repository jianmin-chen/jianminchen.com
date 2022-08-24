import { useRouter } from "next/router";
import { useEffect } from "react";
import Content from "../components/layouts/Content";
import Layout from "../components/Layout";
import { generateMenu, getItemFromRoute } from "../generate";
import convertMDX from "../utils/serialize";

export default function Index({ item, menu }) {
    const router = useRouter();
    useEffect(() => {
        if (item.redirect) {
            router.push(item.redirect);
        }
    });

    return <Layout menu={menu} component={<Content {...item} />} />;
}

export async function getStaticProps(context) {
    let menu = await generateMenu();
    menu = menu.map(item => {
        return {
            route: item.route,
            title: item.title
        };
    });

    const { slug } = context.params;
    const item = await getItemFromRoute(`/${slug}`);
    const source = await convertMDX(item.content);

    return {
        props: {
            item: {
                ...item,
                source
            },
            menu
        }
    };
}

export async function getStaticPaths(context) {
    const menu = await generateMenu();
    const formatted = menu
        .filter(item => item.route != "/")
        .map(item => {
            return {
                params: {
                    slug: item.route.replace(/^\/|\/$/g, "") // Remove slashes at beginning and end
                }
            };
        });

    return {
        paths: formatted,
        fallback: false
    };
}
