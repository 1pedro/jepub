import imageType from "image-type";
import JSZip from "jszip";
import languages from "./i18n";
import { bookConfig, bookToc } from "./templates/epub";
import { cover, info, notes, page, toc } from "./templates/OEBPS";
import * as utils from "./utils";
const container = `<?xml version="1.0" encoding="UTF-8" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
\t<rootfiles>
\t\t<rootfile full-path="book.opf" media-type="application/oebps-package+xml" />
\t</rootfiles>
</container>`;
const mime = "application/epub+zip";
export default class Jepub {
    _i18n;
    _cover;
    _date;
    _images;
    _info;
    _pages;
    _uuid;
    _zip;
    constructor() {
        this._cover = null;
        this._date = utils.getISODate();
        this._i18n = {};
        this._images = [];
        this._info = {
            i18n: "en",
            title: "undefined",
            author: "undefined",
            publisher: "undefined",
            description: "",
            tags: [],
        };
        this._pages = [];
        this._uuid = {};
        this._zip = new JSZip();
    }
    init(details) {
        if (details instanceof JSZip) {
            this._zip = details;
            return this;
        }
        this._info = {
            ...details,
        };
        this._uuid = {
            scheme: "uuid",
            id: utils.uuidv4(),
        };
        if (!languages[this._info.i18n]) {
            throw new Error(`Unknown Language: ${this._info.i18n}`);
        }
        this._i18n = languages[this._info.i18n];
        this._zip = new JSZip();
        this._zip.file("mimetype", mime);
        this._zip.file("epub/container.xml", container);
        this._zip.file("OEBPS/title-page.html", info(this._i18n, this._info.title, this._info.author, this._info.publisher, this._info.tags, utils.parseDOM(this._info.description)));
        return this;
    }
    static html2text(html, noBr = false) {
        return utils.html2text(html, noBr);
    }
    date(date) {
        this._date = utils.getISODate(date);
        return this;
    }
    uuid(id) {
        if (utils.isEmpty(id)) {
            throw new Error("UUID value is empty");
        }
        else {
            let scheme = "uuid";
            if (utils.validateUrl(id)) {
                scheme = "URI";
            }
            this._uuid = {
                scheme,
                id,
            };
            return this;
        }
    }
    cover(data) {
        let ext;
        let mimeCover;
        if (data instanceof Blob) {
            mimeCover = data.type;
            ext = utils.mime2ext(mimeCover);
        }
        else {
            ext = imageType(new Uint8Array(data));
            if (ext) {
                mimeCover = ext.mime;
                ext = utils.mime2ext(mimeCover);
            }
        }
        if (!ext) {
            throw new Error("Cover data is not allowed");
        }
        if (!mimeCover) {
            throw new Error("Cover MIME is invalid");
        }
        this._cover = {
            type: mimeCover,
            path: `OEBPS/cover-image.${ext}`,
        };
        this._zip.file(this._cover.path, data);
        this._zip.file("OEBPS/front-cover.html", cover(this._i18n, this._cover.path));
        return this;
    }
    image(data, name, alt = "") {
        let ext;
        let mimeImage;
        if (data instanceof Blob) {
            mimeImage = data.type;
            ext = utils.mime2ext(mimeImage);
        }
        else {
            ext = imageType(new Uint8Array(data)) || {};
            mimeImage = ext.mime;
            if (ext && mimeImage) {
                ext = utils.mime2ext(mimeImage);
            }
        }
        if (!ext) {
            throw new Error("Image data is not allowed");
        }
        if (!mimeImage) {
            throw new Error("Image MIME is invalid");
        }
        const path = `assets/${name}.${ext}`;
        this._images.push({
            type: mimeImage,
            name,
            path,
            alt,
        });
        if (!this._zip.folder(/assets/).length) {
            this._zip.file(`OEBPS/assets`, null, {
                createFolders: true,
                dir: true,
            });
        }
        this._zip.file(`OEBPS/${path}`, data, { binary: true });
        return this;
    }
    notes(content) {
        if (utils.isEmpty(content)) {
            throw new Error("Notes is empty");
        }
        else {
            this._zip.file("OEBPS/notes.html", notes(this._i18n, utils.parseDOM(content)));
            return this;
        }
    }
    add(title, content, index = this._pages.length) {
        let newContent = content;
        if (utils.isEmpty(title)) {
            throw new Error("Title is empty");
        }
        else if (utils.isEmpty(content)) {
            throw new Error(`Content of ${title} is empty`);
        }
        else {
            if (!Array.isArray(newContent)) {
                this._images.forEach((image) => {
                    newContent = newContent.replace(`{{ ${image.name}-src }}`, image.path);
                    newContent = newContent.replace(`{{ ${image.name}-alt }}`, image.alt || "");
                });
                newContent = utils.parseDOM(newContent);
            }
            this._zip.file(`OEBPS/page-${index}.html`, page(this._i18n, title, newContent));
            this._pages[index] = title;
            return this;
        }
    }
    generate(type = "blob", onUpdate) {
        if (!JSZip.support[type]) {
            throw new Error(`This browser does not support ${type}`);
        }
        const hasNotes = !!this._zip.file("OEBPS/notes.html");
        this._zip.file("book.opf", bookConfig(this._i18n, this._uuid, this._date, this._info.title, this._info.author, this._info.publisher, utils.html2text(this._info.description, true), this._info.tags, this._cover, this._pages, hasNotes, this._images));
        this._zip.file("OEBPS/table-of-contents.html", toc(this._i18n, this._pages));
        this._zip.file("toc.ncx", bookToc(this._i18n, this._uuid, this._info.title, this._info.author, this._pages, hasNotes));
        return this._zip.generateAsync({
            type,
            compression: "DEFLATE",
            compressionOptions: {
                level: 9,
            },
            mimeType: "application/epub+zip",
        }, onUpdate);
    }
}
