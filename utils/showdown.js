import showdown from "showdown";
import showdownHighlight from "showdown-highlight";

export default new showdown.Converter({
    emoji: true,
    omitExtraWLInCodeBlocks: true,
    strikethrough: true,
    tables: true,
    underline: true,
    extensions: [
        showdownHighlight({
            pre: true
        })
    ]
});
