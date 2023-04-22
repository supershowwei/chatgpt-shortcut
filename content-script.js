
const attachShortcuts = function () {
    const $self = $(this);

//     const template = `將下面的英文一字不漏地翻譯成台灣正體中文，言辭要順暢，產生 3 種版本的翻譯結果，只要翻譯就好，不要格式化顯示結果。

// 英文：###
// {{CLIPBOARDTEXT}}
// ###`;
    
    const template = `假設你是一位英文翻譯的專家，請將下面的英文一字不漏地翻譯成台灣正體中文，言辭要順暢，且不要格式化顯示結果。

英文：###
{{CLIPBOARDTEXT}}
###`;
    
    const $shortcutDiv = $(`<div class="shortcut-container"></div>`);
    const $shortcut = $(`<div class="shortcut shortcut-tooltip">英翻中<span class="shortcut-tooltip-text multiline">${template}</div>`);

    $shortcut.on("click", function () {
        navigator.clipboard.readText().then(clipText => {
            $self.find("textarea").val(template.replace(/\{\{CLIPBOARDTEXT\}\}/g, clipText));
            $self.find("button").enable().click();
        });
    });

    $self.before($shortcutDiv.append($shortcut));
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
