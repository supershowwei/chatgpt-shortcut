
const shortcuts = [{
    name: "英翻中",
    content: `將下面的英文一字不漏地翻譯成台灣正體中文，言辭要順暢，產生 3 種版本的翻譯結果，第 2 種版本的翻譯結果是改善自第 1 種版本的翻譯結果，第 3 種翻譯結果是改善自第 2 種翻譯結果，而且只要翻譯就好，內容不是程式碼，請以純文字的方式呈現結果，且不要使用分隔線。

英文：###
{{CLIPBOARDTEXT}}
###`,
    replacement: "{{CLIPBOARDTEXT}}",
    useLineGap: true
},
{
    name: "英翻十中",
    content: `根據上下文，請將下面的英文先作解釋，再一字不漏地給出 10 個台灣正體中文的翻譯結果，而且只要翻譯就好，內容不是程式碼，請以純文字的方式呈現結果，且不要使用分隔線。

英文：###
{{CLIPBOARDTEXT}}
###`,
    replacement: "{{CLIPBOARDTEXT}}",
    useLineGap: true
},
{
    name: "名詞解釋",
    content: `{{CLIPBOARDTEXT}}
其中的 {{_CURSOR_}} 在這個上下文中是什麼意思？請列出 10 種適當的翻譯。`,
    replacement: "{{CLIPBOARDTEXT}}",
    useLineGap: false
},
{
    name: "多作說明",
    content: `針對 {{CLIPBOARDTEXT}} 請多作一些說明`,
    replacement: "{{CLIPBOARDTEXT}}",
    useLineGap: false
},
{
    name: "商品評鑑",
    content: `請幫我寫一篇「{{CLIPBOARDTEXT}}」50 個字的 5 星評價`,
    replacement: "{{CLIPBOARDTEXT}}",
    useLineGap: false
}];

const attachShortcuts = function () {
    const form = document.querySelector("form[class*='stretch']");
    const mainContainer = form.querySelector(".grow");

    const shortcutDiv = document.createElement("div");

    shortcutDiv.className = "shortcut-container";

    shortcuts.forEach((shortcut) => {
        const shortcutElement = document.createElement("div");

        shortcutElement.className = "shortcut shortcut-tooltip";
        shortcutElement.innerHTML = `${shortcut.name}<span class="shortcut-tooltip-text multiline">${shortcut.content}</span>`;

        shortcutElement.addEventListener("click", function () {
            navigator.clipboard.readText().then((clipText) => {
                if (shortcut.useLineGap) {
                    clipText = clipText.replace(/\r/g, "").replace(/\n{2,99}/g, "\n").replace(/\n/g, "\n\n");
                }

                const message = shortcut.replacement && shortcut.content.includes(shortcut.replacement)
                    ? shortcut.content.replace(new RegExp(shortcut.replacement, "g"), clipText)
                    : shortcut.content;

                const textarea = document.querySelector("#prompt-textarea");
                const button = textarea.closest("div").querySelector("button[data-testid='send-button']");

                if (shortcut.content.includes("{{_CURSOR_}}")) {
                    const position = message.replace(/\r/g, "").indexOf("{{_CURSOR_}}");

                    textarea.value = message.replace("{{_CURSOR_}}", "");
                    textarea.focus();

                    textarea.selectionStart = position;
                    textarea.selectionEnd = position;

                    textarea.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
                    textarea.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
                } else {
                    textarea.value = message;
                    textarea.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
                    textarea.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));

                    button.click();
                }
            });
        });

        shortcutDiv.appendChild(shortcutElement);
    });

    mainContainer.insertAdjacentElement("afterbegin", shortcutDiv);
};

const mutationObserver = new MutationObserver((records) => {
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const nodes = record.addedNodes;

        let found;

        for (let j = nodes.length - 1; j >= 0; j--) {
            const node = nodes[j];

            if (!node.querySelector) continue;

            const textarea = node.querySelector("#prompt-textarea");

            if (!textarea) continue;

            const container = document.querySelector("form[class*='stretch'] .grow");

            if (container) {
                attachShortcuts();
                found = true;
                break;
            }
        }

        if (found) break;
    }
});

(() => {
    const container = document.querySelector("form[class*='stretch'] .grow");

    if (container) {
        attachShortcuts();
    }

    mutationObserver.observe(document.querySelector("#__next"), { childList: true, subtree: true });
})();
