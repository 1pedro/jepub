import { v4 } from "uuid";

/**
 * Generates a UUID
 * @see https://stackoverflow.com/a/2117523
 * @returns {string} uuid
 */

export function uuidv4() {
    return v4();
}

/**
 * Checks if a value is object
 * @see https://stackoverflow.com/a/14706877
 * @returns {boolean}
 */
export function isObject(obj) {
    const type = typeof obj;

    return type === "function" || (type === "object" && !!obj);
}

/**
 * Checks if a value is empty
 * @returns {boolean}
 */
export function isEmpty(val) {
    if (val === null) {
        return true;
    } else if (typeof val === "string") {
        return !val.trim();
    }

    return false;
}

/**
 * Get current moment in ISO format
 * @param {Object} date
 * @returns {string} ISO date
 */
export function getISODate(date = new Date()) {
    return date.toISOString();
}

/**
 * Convert HTML to valid XHTML
 * @param {String} html
 * @param {String} outText return as plain text
 */
export function parseDOM(html, outText = false): string {
    const doc = new DOMParser().parseFromString(
        `<!doctype html><body>${html}`,
        "text/html"
    );

    if (outText) {
        return doc.body.textContent.trim();
    }

    const docs = new XMLSerializer().serializeToString(doc.body);

    return docs.replace(/(^<body\s?[^>]*>|<\/body>$)/g, "");
}

/**
 * Convert HTML to plain text
 * @param {String} html
 * @param noBr
 */
export function html2text(html: string, noBr: boolean = false) {
    let newHtml = html;

    newHtml = newHtml.replace(/<style([\s\S]*?)<\/style>/gi, "");
    newHtml = newHtml.replace(/<script([\s\S]*?)<\/script>/gi, "");
    newHtml = newHtml.replace(/<\/(div|p|li|dd|h[1-6])>/gi, "\n");
    newHtml = newHtml.replace(/<(br|hr)\s*[/]?>/gi, "\n");
    newHtml = newHtml.replace(/<li>/gi, "+ ");
    newHtml = newHtml.replace(/<[^>]+>/g, "");
    newHtml = newHtml.replace(/\n{3,}/g, "\n\n");

    if (noBr) {
        newHtml = newHtml.replace(/\n+/g, " ");
    }

    return parseDOM(newHtml, true);
}

/**
 * @see https://gist.github.com/dperini/729294
 * @param {String} value
 */
export function validateUrl(value) {
    return /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
        value
    );
}

/**
 * Convert MIME type to extension
 * @param {String} mime
 */
export function mime2ext(mime) {
    let ext = null;

    switch (mime) {
        case "image/jpg":
        case "image/jpeg":
            ext = "jpg";
            break;
        case "image/svg+xml":
            ext = "svg";
            break;
        case "image/gif":
        case "image/apng":
        case "image/png":
        case "image/webp":
        case "image/bmp":
            // eslint-disable-next-line prefer-destructuring
            ext = mime.split("/")[1];
            break;
        default:
            ext = null;
            break;
    }

    return ext;
}

// TODO: kepub
// Wrap text, image <span class="koboSpan" id="kobo.{para:số thứ tự đoạn văn, bắt đầu bằng 1}.{seg: số thứ tự cụm bị wrap, bắt đầu bằng 1}">text</span>
// https://github.com/pgaskin/kepubify/blob/871aa0bb2047b5ba171bc608024bdb180cb29d70/kepub/transform.go#L173

// UnescapeString
// var htmlEscaper = strings.NewReplacer(
// 	`&`, "&amp;",
// 	`'`, "&#39;", // "&#39;" is shorter than "&apos;" and apos was not in HTML until HTML5.
// 	`<`, "&lt;",
// 	`>`, "&gt;",
// 	`"`, "&#34;", // "&#34;" is shorter than "&quot;".
// )
