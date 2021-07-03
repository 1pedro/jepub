"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookToc = exports.bookConfig = void 0;
function bookConfig(i18n, uuid, date, title, author, publisher, description, tags, cover, pages, notes, images) {
    if (description === void 0) { description = ""; }
    var buildPages = "";
    var buildTocPages = "";
    var buildTags = "";
    var buildImages = "";
    var buildDescription = description
        ? "<dc:description>" + description + "</dc:description>"
        : "";
    var buildCover = cover
        ? "<meta name=\"cover\" content=\"cover-image\" />"
        : "";
    if (pages && pages.length) {
        pages.forEach(function (page, index) {
            buildPages += "<item id=\"page-" + index + "\" href=\"OEBPS/page-" + index + ".html\" media-type=\"application/xhtml+xml\" />";
            buildTocPages += "<itemref idref=\"page-" + index + "\" linear=\"yes\" />";
        });
    }
    if (tags && tags.length) {
        tags.forEach(function (tag) {
            buildTags += "<dc:subject>" + tag + "</dc:subject>";
        });
    }
    images.length &&
        images.forEach(function (image) {
            buildImages += "<item id=\"" + image.name + "\" href=\"OEBPS/" + image.path + "\" media-type=\"" + image.type + "\" />";
        });
    return "\n    <?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<package version=\"2.0\" xmlns=\"http://www.idpf.org/2007/opf\" unique-identifier=\"PrimaryID\">\n\n\t<metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:opf=\"http://www.idpf.org/2007/opf\">\n\t\t<dc:title>" + title + "</dc:title>\n\t\t<dc:language>" + ((i18n === null || i18n === void 0 ? void 0 : i18n.code) || "") + "</dc:language>\n\t\t<dc:identifier id=\"PrimaryID\" opf:scheme=\"" + uuid.scheme + "\">" + uuid.id + "</dc:identifier>\n        <dc:date opf:event=\"publication\">" + date + "</dc:date>\n        " + buildDescription + "\n\t\t<dc:creator opf:role=\"aut\">" + author + "</dc:creator>\n\t\t<dc:publisher>" + publisher + "</dc:publisher>\n        " + buildCover + "\n        " + buildTags + "\n\t</metadata>\n\n\t<manifest>\n\t\t    " + (cover
        ? '<item id="front-cover" href="OEBPS/front-cover.html" media-type="application/xhtml+xml" />'
        : "") + "\n\t\t<item id=\"title-page\" href=\"OEBPS/title-page.html\" media-type=\"application/xhtml+xml\" />\n\t\t<item id=\"notes\" href=\"OEBPS/notes.html\" media-type=\"application/xhtml+xml\" />\n\t\t<item id=\"table-of-contents\" href=\"OEBPS/table-of-contents.html\" media-type=\"application/xhtml+xml\" />\n        " + buildPages + "\n\n\t\t   " + (cover
        ? "<item id=\"cover-image\" href=\"" + cover.path + "\" media-type=\"" + cover.type + "\" properties=\"cover-image\" />"
        : "") + "\n\n\t\t<item id=\"ncx\" href=\"toc.ncx\" media-type=\"application/x-dtbncx+xml\" />\n        " + buildImages + "\n\t</manifest>\n\n\t<spine toc=\"ncx\">\n\t\t    " + (cover ? '<itemref idref="front-cover" linear="no" />' : "") + "\n\t\t<itemref idref=\"title-page\" linear=\"yes\" />\n\t\t<itemref idref=\"table-of-contents\" linear=\"yes\" />\n        " + buildTocPages + "\n\n        " + (notes ? "<itemref idref=\"notes\" linear=\"yes\" />" : "") + "\n\t</spine>\n\n\t<guide>\n\t\t    " + (cover
        ? "<reference type=\"cover\" title=\"" + ((i18n === null || i18n === void 0 ? void 0 : i18n.cover) || "") + "\" href=\"OEBPS/front-cover.html\" />"
        : "") + "\n\t\t<reference type=\"toc\" title=\"" + ((i18n === null || i18n === void 0 ? void 0 : i18n.toc) || "") + "\" href=\"OEBPS/table-of-contents.html\" />\n\t</guide>\n\n</package>\n";
}
exports.bookConfig = bookConfig;
function bookToc(i18n, uuid, title, author, pages, hasNotes) {
    var buildPages = "";
    var buildNotes = "";
    if (pages && pages.length) {
        pages.forEach(function (pageTitle, index) {
            buildPages += "\n            <navPoint id=\"page-" + index + "\" playOrder=\"" + (index + 3) + "\">\n                <navLabel>\n                    <text>" + pageTitle + "</text>\n                </navLabel>\n                <content src=\"OEBPS/page-" + index + ".html\" />\n            </navPoint>";
        });
    }
    if (hasNotes) {
        buildNotes = "\n        <navPoint id=\"notes-page\" playOrder=\"2\">\n                <navLabel>\n                    <text>" + ((i18n === null || i18n === void 0 ? void 0 : i18n.note) || "") + "</text>\n                </navLabel>\n                <content src=\"OEBPS/notes.html\" />\n            </navPoint>";
    }
    return "\n    <?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE ncx PUBLIC \"-//NISO//DTD ncx 2005-1//EN\" \"http://www.daisy.org/z3986/2005/ncx-2005-1.dtd\">\n\n<ncx version=\"2005-1\" xml:lang=\"" + ((i18n === null || i18n === void 0 ? void 0 : i18n.code) || "") + "\" xmlns=\"http://www.daisy.org/z3986/2005/ncx/\">\n\t<head>\n\t\t<meta name=\"dtb:uid\" content=\"" + uuid.id + "\" />\n\t\t<meta name=\"dtb:depth\" content=\"2\" />\n\t\t<meta name=\"dtb:totalPageCount\" content=\"0\" />\n\t\t<meta name=\"dtb:maxPageNumber\" content=\"0\" />\n\t</head>\n\n\t<docTitle>\n\t\t<text>" + title + "</text>\n\t</docTitle>\n\n\t<docAuthor>\n\t\t<text>" + author + "</text>\n\t</docAuthor>\n\n\t<navMap>\n\t\t<navPoint id=\"title-page\" playOrder=\"1\">\n\t\t\t<navLabel>\n\t\t\t\t<text>" + ((i18n === null || i18n === void 0 ? void 0 : i18n.info) || "") + "</text>\n\t\t\t</navLabel>\n\t\t\t<content src=\"OEBPS/title-page.html\" />\n\t\t</navPoint>\n\t\t<navPoint id=\"table-of-contents\" playOrder=\"2\">\n\t\t\t<navLabel>\n\t\t\t\t<text>" + ((i18n === null || i18n === void 0 ? void 0 : i18n.toc) || "") + "</text>\n\t\t\t</navLabel>\n\t\t\t<content src=\"OEBPS/table-of-contents.html\" />\n\t\t</navPoint>\n        " + buildPages + "\n        " + buildNotes + "\n\t</navMap>\n</ncx>\n";
}
exports.bookToc = bookToc;
