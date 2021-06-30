"use strict";

import * as utils from "./utils";
import imageType from "image-type";

import language from "./i18n.json";

const container = `<?xml version="1.0" encoding="UTF-8" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
\t<rootfiles>
\t\t<rootfile full-path="book.opf" media-type="application/oebps-package+xml" />
\t</rootfiles>
</container>`;

const mime = "application/epub+zip";

import { makeCover, makeNotes, makePage, makeToc, makeInfo } from './templates/OEBPS'

import { bookConfig } from './templates/epub'
import {toc} from './templates/epub'

import JSZip from "jszip";

export default class jEpub {
    constructor() {
        this._I18n = {};
        this._Info = {};
        this._Uuid = {};
        this._Date = null;
        this._Cover = null;

        this._Pages = [];
        this._Images = [];

        this._Zip = {};
    }

    init(details) {
        if (details instanceof JSZip) {
            this._Zip = details;
            return this;
        }

        this._Info = Object.assign(
            {},
            {
                i18n: "en",
                title: "undefined",
                author: "undefined",
                publisher: "undefined",
                description: "",
                tags: [],
            },
            details
        );

        this._Uuid = {
            scheme: "uuid",
            id: utils.uuidv4(),
        };

        this._Date = utils.getISODate();

        if (!language[this._Info.i18n])
            throw `Unknown Language: ${this._Info.i18n}`;
        this._I18n = language[this._Info.i18n];

        this._Zip = new JSZip();
        this._Zip.file("mimetype", mime);
        this._Zip.file("epub/container.xml", container);
        this._Zip.file(
            "OEBPS/title-page.html",
            makeInfo(this._I18n,
            this._Info.title,
            this._Info.author,
            this._Info.publisher,
            this._Info.tags,
            utils.parseDOM(this._Info.description))
        );
        return this;
    }

    static html2text(html, noBr = false) {
        return utils.html2text(html, noBr);
    }

    date(date) {
        if (date instanceof Date) {
            this._Date = utils.getISODate(date);
            return this;
        } else {
            throw "Date object is not valid";
        }
    }

    uuid(id) {
        if (utils.isEmpty(id)) {
            throw "UUID value is empty";
        } else {
            let scheme = "uuid";
            if (utils.validateUrl(id)) scheme = "URI";
            this._Uuid = {
                scheme: scheme,
                id: id,
            };
            return this;
        }
    }

    cover(data) {
        let ext, mime;
        if (data instanceof Blob) {
            mime = data.type;
            ext = utils.mime2ext(mime);
        } else if (data instanceof ArrayBuffer) {
            ext = imageType(new Uint8Array(data));
            if (ext) {
                mime = ext.mime;
                ext = utils.mime2ext(mime);
            }
        } else {
            throw "Cover data is not valid";
        }
        if (!ext) throw "Cover data is not allowed";

        this._Cover = {
            type: mime,
            path: `OEBPS/cover-image.${ext}`,
        };
        this._Zip.file(this._Cover.path, data);
        this._Zip.file(
            "OEBPS/front-cover.html",
            makeCover(this._I18n, this._Cover.path)
        );
        return this;
    }

    image(data, name, alt="") {
        let ext, mime;
        if (data instanceof Blob) {
            mime = data.type;
            ext = utils.mime2ext(mime);
        } else if (data instanceof ArrayBuffer) {
            ext = imageType(new Uint8Array(data));
            mime = ext.mime;
            if (ext) ext = utils.mime2ext(mime);
        } else {
            throw "Image data is not valid";
        }
        if (!ext) throw "Image data is not allowed";

        const filePath = `assets/${name}.${ext}`;
        this._Images[name] = {
            type: mime,
            path: filePath,
            alt
        };
        this._Zip.file(`OEBPS/${filePath}`, data);
        return this;
    }

    notes(content) {
        if (utils.isEmpty(content)) {
            throw "Notes is empty";
        } else {
            this._Zip.file(
                "OEBPS/notes.html",
                makeNotes(this._I18n,  utils.parseDOM(content))
            );
            return this;
        }
    }

    add(title, content, index = this._Pages.length) {
        if (utils.isEmpty(title)) {
            throw "Title is empty";
        } else if (utils.isEmpty(content)) {
            throw `Content of ${title} is empty`;
        } else {
            if (!Array.isArray(content)) {

                this._Images.forEach((img, index) => {
                    content = content.replace(`{{ ${img.name} }}`, `<img src="${img.path}" alt=""> </img>`);
                })
                content = utils.parseDOM(content);
            }
            this._Zip.file(
                `OEBPS/page-${index}.html`,
                makePage(this._I18n, title, content)
            );
            this._Pages[index] = title;
            return this;
        }
    }

    generate(type = "blob", onUpdate) {
        if (!JSZip.support[type]) throw `This browser does not support ${type}`;

        let notes = this._Zip.file("OEBPS/notes.html");
        notes = !!notes;

        this._Zip.file(
            "book.opf",

            bookConfig(
            this._I18n,
            this._Uuid,
            this._Date,
            this._Info.title,
            this._Info.author,
            this._Info.publisher,
            utils.html2text(this._Info.description, true),
            this._Info.tags,
            this._Cover,
            this._Pages,
            notes,
            this._Images
            )
        );

        this._Zip.file(
            "OEBPS/table-of-contents.html",
            makeToc(this._I18n,this._Pages)
        );

        this._Zip.file(
            "toc.ncx",
            toc(this._I18n,
            this._Uuid,
            this._Info.title,
            this._Info.author,
            this._Pages,
            notes)
        );

        return this._Zip.generateAsync(
            {
                type: type,
                mimeType: mime,
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9,
                },
            },
            onUpdate
        );
    }
}
