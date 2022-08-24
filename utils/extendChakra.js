import { extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

// Use styling based on ./styles/blog.scss
const monospace = "'Fira Mono', monospace";
const sansSerif = "'Inter', sans-serif";
const serif = "'EB Garamond', serif";

export default extendTheme(
    {
        fonts: {
            heading: sansSerif,
            body: sansSerif
        }
    },
    withProse({
        baseStyle: {
            "fontFamily": serif,
            "fontSize": "1.5rem",
            "lineHeight": "1.6",
            "a": {
                color: "#0099ff",
                fontWeight: "normal",
                textDecoration: "underline",
                _focus: { outline: "none" }
            },
            "blockquote": {
                borderStartWidth: "5px",
                borderStartColor: "black",
                fontStyle: "normal",
                marginStart: 8
            },
            "code": {
                "fontFamily": monospace,
                "fontSize": "1.1rem",
                "fontWeight": "normal",
                "&::before, &::after": { content: "''" }
            },
            "pre": {
                "backgroundColor": "#151515",
                "borderRadius": "0.5rem",
                "boxShadow": "0 0.2rem 1.2rem rgba(0, 0, 0, 0.2)",
                "padding": "40px 20px 5px 20px",
                "position": "relative",
                "whiteSpace": "pre-wrap",
                "&::before": {
                    content: "'🔴 🟡 🟢'",
                    fontSize: "12px",
                    position: "absolute",
                    top: "19px",
                    left: "30px"
                },
                "code": { backgroundColor: "#151515" }
            },
            "h1": { fontFamily: serif },
            "h2": { fontFamily: serif },
            "h3": { fontFamily: serif },
            "h4": { fontFamily: serif },
            "h5": { fontFamily: serif },
            "h6": { fontFamily: serif },
            "hr": { borderTopColor: "black" },
            "img": {
                "&:not(#email-signature)": {
                    boxShadow: "0 0.2rem 1.2rem rgba(0, 0, 0, 0.2)",
                    display: "block",
                    margin: "auto",
                    padding: "20px"
                }
            },
            "p": {
                fontFamily: serif,
                fontSize: "1.5rem",
                lineHeight: "1.6"
            },
            "table": {
                thead: { borderBottomColor: "black" },
                tbody: { tr: { borderBottomColor: "black" } }
            },
            "li": { my: 0 },
            "ol > li::marker": { color: "black" },
            "ul > li::marker": { color: "black" }
        }
    })
);
