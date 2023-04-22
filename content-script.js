
const shortcuts = [{
    name: "英翻中",
    content: `將下面的英文一字不漏地翻譯成台灣正體中文，言辭要順暢，產生 3 種版本的翻譯結果，只要翻譯就好，不要格式化顯示結果。

英文：###
{{CLIPBOARDTEXT}}
###`,
    replacement: "{{CLIPBOARDTEXT}}"
},
{
    name: "名詞解釋",
    content: `{{CLIPBOARDTEXT}} 中的 {{_CURSOR_}} 在這裡是什麼意思？可以有幾種翻譯？`,
    replacement: "{{CLIPBOARDTEXT}}"
}];

const attachShortcuts = function () {
    const $self = $(this);

    const $shortcutDiv = $(`<div class="shortcut-container"></div>`);

    shortcuts.forEach(shortcut => {

        $(`<div class="shortcut shortcut-tooltip">${shortcut.name}<span class="shortcut-tooltip-text multiline">${shortcut.content}</div>`)
            .on("click", function () {
                navigator.clipboard.readText().then(clipText => {
                    const message = shortcut.replacement && shortcut.content.includes(shortcut.replacement)
                        ? shortcut.content.replace(new RegExp(shortcut.replacement, "g"), clipText)
                        : shortcut.content;

                    const $textarea = $self.find("textarea");

                    if (shortcut.content.includes("{{_CURSOR_}}")) {
                        const position = message.indexOf("{{_CURSOR_}}");

                        $textarea.val(message.replace("{{_CURSOR_}}", "")).focus();

                        $textarea[0].selectionStart = position;
                        $textarea[0].selectionEnd = position;

                        $self.find("button").enable();
                    } else {
                        $self.find("button").enable().click();
                    }

                });
            })
            .appendTo($shortcutDiv);

    });

    $self.before($shortcutDiv);
}

attachShortcuts.call($("form[class*='stretch'] textarea").closest("div")[0]);

var mutationObserver = new MutationObserver(records => {
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const nodes = record.addedNodes;

        let found;

        for (let j = nodes.length - 1; j >= 0; j--) {
            const $node = $(nodes[j]);

            const $inputDiv = $node.find("form[class*='stretch'] textarea").closest("div")

            if ($inputDiv.length > 0) {
                attachShortcuts.call($inputDiv[0]);
                found = true;
                break;
            }
        }

        if (found) break;
    }
});

mutationObserver.observe($("#__next")[0], { childList: true, subtree: true });
