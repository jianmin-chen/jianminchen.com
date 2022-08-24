import Content from "../components/layouts/Content";
import Layout from "../components/Layout";
import { generateMenu, getItemFromRoute } from "../generate";
import convertMDX from "../utils/serialize";

export default function Index({ item, menu }) {
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

    const item = await getItemFromRoute("/");
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
