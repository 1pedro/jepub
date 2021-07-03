"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = void 0;
function info(i18n, title, author, publisher, tags, description) {
    if (description === void 0) { description = ""; }
    var buildTags = "";
    var buildDescription = "";
    if (Array.isArray(tags) && tags.length) {
        buildTags += '<div class="part-title-wrap">';
        tags.forEach(function (tag) {
            buildTags += "<code> " + tag + " </code>";
        });
        buildTags += "</div>";
    }
    if (description) {
        buildDescription += "<div class=\"ugc\"> " + description + " </div>";
    }
    return "\n    <?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"" + i18n.code + "\">\n\n<head>\n\t<title>" + i18n.info + "</title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div id=\"title-page\">\n\t\t<h1 class=\"title\">" + title + "</h1>\n\t\t<h2 class=\"subtitle\"></h2>\n\t\t<h3 class=\"author\">" + author + "</h3>\n\t\t<h4 class=\"publisher\">" + publisher + "</h4>\n\t</div>\n    " + buildTags + "\n\n    " + buildDescription + "\n</body>\n\n</html>\n";
}
exports.info = info;
