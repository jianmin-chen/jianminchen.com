import Link from "next/link";
import styles from "./Tabs.module.scss";

export default function Tabs({ active, categories }) {
    return (
        <div className={styles.tabs}>
            {categories.map((category, key) => (
                <Link href={category} key={key}>
                    <div
                        className={`${
                            active === category ? styles.active : ""
                        } ${styles.tab}`}>
                        {category}
                    </div>
                </Link>
            ))}
        </div>
    );
}
