"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = void 0;
function page(i18n, title, content) {
    var contents = "";
    if (Array.isArray(content)) {
        content.forEach(function (item) {
            contents += "<p class=\"indent\">" + item + "</p>";
        });
    }
    else {
        contents = content;
    }
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"" + i18n.code + "\">\n\n<head>\n\t<title>" + title + "</title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div class=\"chapter type-1\">\n\t\t<div class=\"chapter-title-wrap\">\n\t\t\t<h2 class=\"chapter-title\">" + title + "</h2>\n\t\t</div>\n\t\t<div class=\"ugc chapter-ugc\">\n            " + contents + "\n\t\t</div>\n\t</div>\n</body>\n\n</html>\n";
}
exports.page = page;
