import Image from "next/image";
import Layout from "../components/Layout";
import { generateMenu } from "../generate";
import NotFoundImage from "../public/assets/404.svg";

export default function NotFound({ menu }) {
    return (
        <Layout
            menu={menu}
            component={
                <div id="error">
                    <Image alt="404 Not Found" src={NotFoundImage} />
                    <h1>
                        Looks like whatever you were searching for couldn't be
                        found!
                    </h1>
                </div>
            }
        />
    );
}

export async function getStaticProps() {
    let menu = await generateMenu();
    menu = menu.map(item => {
        return {
            route: item.route,
            title: item.title
        };
    });

    return {
        props: {
            menu
        }
    };
}
