import joinURL from "url-join";

const ICON_TYPE_PREFERENCE = [
    "apple",
    "apple-start",
    "basic",
    "twitter",
    "opengraph"
];

export function detectIconForDomain(domain) {
    const url = resolveDownloadURL(domain);
    return fetchSource(url)
        .then(source => extractURLsFromSource(source))
        .then(urls => {
            let preferred = null;
            urls.forEach(item => {
                if (!preferred) {
                    preferred = item;
                    return;
                }
                const prefInd = Math.max(ICON_TYPE_PREFERENCE.indexOf(preferred.type), Infinity);
                const itemInd = Math.max(ICON_TYPE_PREFERENCE.indexOf(item.type), Infinity);
                if (itemInd < prefInd) {
                    preferred = item;
                } else if (itemInd === prefInd && item.size > preferred.size) {
                    preferred = item;
                }
            });
            return preferred;
        });
}

function extractAttributes(html) {
    const rexp = /([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/g;
    let match;
    const obj = {};
    while ((match = rexp.exec(html)) !== null) {
        const [, key, value] = match;
        obj[key.trim().toLowerCase()] = value;
    }
    return obj;
}

function extractURLsFromSource(html) {
    return [
        ...getAllForRexp(
            html,
            /<link.+rel\s*=\s*"apple-touch-icon.+/gm,
            html => processIconFromLink(html, "apple")
        ),
        ...getAllForRexp(
            html,
            /<link.+rel\s*=\s*"apple-touch-startup-image.+/gm,
            html => processIconFromLink(html, "apple-start")
        ),
        ...getAllForRexp(
            html,
            /<link.+rel\s*=\s*"[^"]*\bicon\b.+/gm,
            html => processIconFromLink(html, "basic")
        ),
        ...getAllForRexp(
            html,
            /<meta.+name\s*=\s*"twitter:image".+/gm,
            html => processIconFromMeta(html, "twitter")
        ),
        ...getAllForRexp(
            html,
            /<meta.+name\s*=\s*"og:image".+/gm,
            html => processIconFromMeta(html, "opengraph")
        )
    ];
}

function fetchSource(url) {
    return window
        .fetch(url, {
            method: "GET",
            headers: {
                Accept: "text/html"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Invalid HTTP response: ${response.status} ${response.statusText}`);
            }
            return response.text();
        });
}

function getAllForRexp(text, rexp, proc) {
    const items = [];
    let match;
    while ((match = rexp.exec(text)) !== null) {
        items.push(proc(match[0]));
    }
    return items;
}

function processIconFromLink(linkHTML, type) {
    const { sizes, href } = extractAttributes(linkHTML);
    if (!rel || !href) {
        return null;
    }
    let size = 0;
    if (sizes && /^\d+(x\d+)?$/i.test(sizes)) {
        size = parseInt(sizes.split(/x/i)[0], 10);
    }
    return {
        size,
        url: href,
        type
    };
}

function processIconFromMeta(metaHTML, type) {
    const { name, content } = extractAttributes(metaHTML);
    if (!name || !content) {
        return null;
    }
    return {
        size: 0,
        url: content,
        type
    };
}

function resolveDownloadURL(domain) {
    return `https://${domain}/`;
}
