"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
var image_type_1 = __importDefault(require("image-type"));
var jszip_1 = __importDefault(require("jszip"));
var i18n_json_1 = __importDefault(require("./i18n.json"));
var epub_1 = require("./templates/epub");
var OEBPS_1 = require("./templates/OEBPS");
var utils = __importStar(require("./utils"));
var container = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<container version=\"1.0\" xmlns=\"urn:oasis:names:tc:opendocument:xmlns:container\">\n\t<rootfiles>\n\t\t<rootfile full-path=\"book.opf\" media-type=\"application/oebps-package+xml\" />\n\t</rootfiles>\n</container>";
var mime = "application/epub+zip";
var Jepub = /** @class */ (function () {
    function Jepub() {
        this._Cover = null;
        this._Date = null;
        this._I18n = {};
        this._Images = [];
        this._Info = {};
        this._Pages = [];
        this._Uuid = {};
        this._Zip = new jszip_1.default();
    }
    Jepub.prototype.init = function (details) {
        if (details instanceof jszip_1.default) {
            this._Zip = details;
            return this;
        }
        this._Info = __assign({ i18n: "en", title: "undefined", author: "undefined", publisher: "undefined", description: "", tags: [] }, details);
        this._Uuid = {
            scheme: "uuid",
            id: utils.uuidv4(),
        };
        this._Date = utils.getISODate();
        if (!i18n_json_1.default[this._Info.i18n]) {
            throw new Error("Unknown Language: " + this._Info.i18n);
        }
        this._I18n = i18n_json_1.default[this._Info.i18n];
        this._Zip = new jszip_1.default();
        this._Zip.file("mimetype", mime);
        this._Zip.file("epub/container.xml", container);
        this._Zip.file("OEBPS/title-page.html", OEBPS_1.info(this._I18n, this._Info.title, this._Info.author, this._Info.publisher, this._Info.tags, utils.parseDOM(this._Info.description)));
        return this;
    };
    Jepub.html2text = function (html, noBr) {
        if (noBr === void 0) { noBr = false; }
        return utils.html2text(html, noBr);
    };
    Jepub.prototype.date = function (date) {
        if (date instanceof Date) {
            this._Date = utils.getISODate(date);
            return this;
        }
        throw new Error("Date object is not valid");
    };
    Jepub.prototype.uuid = function (id) {
        if (utils.isEmpty(id)) {
            throw new Error("UUID value is empty");
        }
        else {
            var scheme = "uuid";
            if (utils.validateUrl(id)) {
                scheme = "URI";
            }
            this._Uuid = {
                scheme: scheme,
                id: id,
            };
            return this;
        }
    };
    Jepub.prototype.cover = function (data) {
        var ext;
        var mimeCover;
        if (data instanceof Blob) {
            mimeCover = data.type;
            ext = utils.mime2ext(mimeCover);
        }
        else if (data instanceof ArrayBuffer) {
            ext = image_type_1.default(new Uint8Array(data));
            if (ext) {
                mimeCover = ext.mime;
                ext = utils.mime2ext(mimeCover);
            }
        }
        else {
            throw new Error("Cover data is not valid");
        }
        if (!ext) {
            throw new Error("Cover data is not allowed");
        }
        this._Cover = {
            type: mimeCover,
            path: "OEBPS/cover-image." + ext,
        };
        this._Zip.file(this._Cover.path, data);
        this._Zip.file("OEBPS/front-cover.html", OEBPS_1.cover(this._I18n, this._Cover.path));
        return this;
    };
    Jepub.prototype.image = function (data, name, alt) {
        if (alt === void 0) { alt = ""; }
        var ext;
        var mimeImage;
        if (data instanceof Blob) {
            mimeImage = data.type;
            ext = utils.mime2ext(mimeImage);
        }
        else if (data instanceof ArrayBuffer) {
            ext = image_type_1.default(new Uint8Array(data));
            mimeImage = ext.mime;
            if (ext) {
                ext = utils.mime2ext(mimeImage);
            }
        }
        else {
            throw new Error("Image data is not valid");
        }
        if (!ext) {
            throw new Error("Image data is not allowed");
        }
        var path = "assets/" + name + "." + ext;
        this._Images.push({
            type: mimeImage,
            name: name,
            path: path,
            alt: alt,
        });
        this._Zip.file("OEBPS/" + path, data);
        return this;
    };
    Jepub.prototype.notes = function (content) {
        if (utils.isEmpty(content)) {
            throw new Error("Notes is empty");
        }
        else {
            this._Zip.file("OEBPS/notes.html", OEBPS_1.notes(this._I18n, utils.parseDOM(content)));
            return this;
        }
    };
    Jepub.prototype.add = function (title, content, index) {
        if (index === void 0) { index = this._Pages.length; }
        var newContent = content;
        if (utils.isEmpty(title)) {
            throw new Error("Title is empty");
        }
        else if (utils.isEmpty(content)) {
            throw new Error("Content of " + title + " is empty");
        }
        else {
            if (!Array.isArray(newContent)) {
                this._Images.forEach(function (image) {
                    newContent = newContent.replace("{{ " + image.name + "-src }}", image.path);
                    newContent = newContent.replace("{{ " + image.name + "-alt }}", image.alt);
                });
                newContent = utils.parseDOM(newContent);
            }
            this._Zip.file("OEBPS/page-" + index + ".html", OEBPS_1.page(this._I18n, title, newContent));
            this._Pages[index] = title;
            return this;
        }
    };
    Jepub.prototype.generate = function (type, onUpdate) {
        if (type === void 0) { type = "blob"; }
        if (!jszip_1.default.support[type]) {
            throw new Error("This browser does not support " + type);
        }
        var hasNotes = this._Zip.file("OEBPS/notes.html");
        hasNotes = !!hasNotes;
        this._Zip.file("book.opf", epub_1.bookConfig(this._I18n, this._Uuid, this._Date, this._Info.title, this._Info.author, this._Info.publisher, utils.html2text(this._Info.description, true), this._Info.tags, this._Cover, this._Pages, OEBPS_1.notes, this._Images));
        this._Zip.file("OEBPS/table-of-contents.html", OEBPS_1.toc(this._I18n, this._Pages));
        this._Zip.file("toc.ncx", epub_1.bookToc(this._I18n, this._Uuid, this._Info.title, this._Info.author, this._Pages, hasNotes));
        return this._Zip.generateAsync({
            type: type,
            compression: "DEFLATE",
            compressionOptions: {
                level: 9,
            },
            mimeType: "application/epub+zip",
        }, onUpdate);
    };
    return Jepub;
}());
exports.default = Jepub;
