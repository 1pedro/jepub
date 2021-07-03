"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cover = void 0;
function cover(i18n, coverPath) {
    return "\n<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"" + i18n.code + "\">\n\n<head>\n\t<title>" + i18n.cover + "</title>\n\t<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />\n</head>\n\n<body>\n\t<div id=\"cover-image\">\n\t\t<img src=\"../" + coverPath + "\" alt=\"" + i18n.cover + "\" />\n\t</div>\n</body>\n\n</html>\n";
}
exports.cover = cover;
