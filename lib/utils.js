"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mime2ext = exports.validateUrl = exports.html2text = exports.parseDOM = exports.getISODate = exports.isEmpty = exports.isObject = exports.uuidv4 = void 0;
var uuid_1 = require("uuid");
/**
 * Generates a UUID
 * @see https://stackoverflow.com/a/2117523
 * @returns {string} uuid
 */
function uuidv4() {
    return uuid_1.v4();
}
exports.uuidv4 = uuidv4;
/**
 * Checks if a value is object
 * @see https://stackoverflow.com/a/14706877
 * @returns {boolean}
 */
function isObject(obj) {
    var type = typeof obj;
    return type === "function" || (type === "object" && !!obj);
}
exports.isObject = isObject;
/**
 * Checks if a value is empty
 * @returns {boolean}
 */
function isEmpty(val) {
    if (val === null) {
        return true;
    }
    else if (typeof val === "string") {
        return !val.trim();
    }
    return false;
}
exports.isEmpty = isEmpty;
/**
 * Get current moment in ISO format
 * @param {Object} date
 * @returns {string} ISO date
 */
function getISODate(date) {
    if (date === void 0) { date = new Date(); }
    return date.toISOString();
}
exports.getISODate = getISODate;
/**
 * Convert HTML to valid XHTML
 * @param {String} html
 * @param {String} outText return as plain text
 */
function parseDOM(html, outText) {
    if (outText === void 0) { outText = false; }
    var doc = new DOMParser().parseFromString("<!doctype html><body>" + html, "text/html");
    if (outText) {
        return doc.body.textContent.trim();
    }
    var docs = new XMLSerializer().serializeToString(doc.body);
    return docs.replace(/(^<body\s?[^>]*>|<\/body>$)/g, "");
}
exports.parseDOM = parseDOM;
/**
 * Convert HTML to plain text
 * @param {String} html
 * @param noBr
 */
function html2text(html, noBr) {
    if (noBr === void 0) { noBr = false; }
    var newHtml = html;
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
exports.html2text = html2text;
/**
 * @see https://gist.github.com/dperini/729294
 * @param {String} value
 */
function validateUrl(value) {
    return /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}
exports.validateUrl = validateUrl;
/**
 * Convert MIME type to extension
 * @param {String} mime
 */
function mime2ext(mime) {
    var ext = null;
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
exports.mime2ext = mime2ext;
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
