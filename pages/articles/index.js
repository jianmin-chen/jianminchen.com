import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { generateCategories, generateMenu } from "../../generate";

export default function Articles({ menu, redirect }) {
    const router = useRouter();
    useEffect(() => {
        router.push(redirect);
    });

    return <Layout menu={menu} component={<Loader />} />;
}

export async function getStaticProps() {
    let menu = await generateMenu();
    menu = menu.map(item => {
        return {
            route: item.route,
            title: item.title
        };
    });

    const categories = await generateCategories();

    return {
        props: {
            menu,
            redirect: `/articles/${categories[0]}`
        }
    };
}
