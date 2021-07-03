"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toc = void 0;
function toc(i18n, pages) {
    var buildPages = "";
    pages.forEach(function (title, index) {
        buildPages += "\n        <li class=\"chaptertype-1\">\n            <a href=\"page-" + index + ".html\">\n                <span class=\"toc-chapter-title\">" + title + "</span>\n            </a>\n        </li>\n        ";
    });
    return "\n    <?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"" + i18n.code + "\">\n\n<head>\n\t<title>" + i18n.toc + "</title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div id=\"toc\">\n\t\t<h1>" + i18n.toc + "</h1>\n\t\t<ul>\n        " + buildPages + "\n\t\t</ul>\n\t</div>\n</body>\n\n</html>\n";
}
exports.toc = toc;
