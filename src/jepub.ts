/* eslint-disable no-underscore-dangle */
import imageType from "image-type";
import JSZip from "jszip";

import language from "src/i18n.json";
import { cover, info, notes, page, toc } from "src/templates/OEBPS";

import { jEpub, jEpubInfo } from "./declare";
import { bookConfig, bookToc } from "./templates/epub";
import * as utils from "./utils";

const container = `<?xml version="1.0" encoding="UTF-8" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
\t<rootfiles>
\t\t<rootfile full-path="book.opf" media-type="application/oebps-package+xml" />
\t</rootfiles>
</container>`;

const mime = "application/epub+zip";

export default class Jepub implements jEpub {
    _I18n: jEpub["_I18n"];
    _Cover: jEpub["_Cover"];
    _Date: jEpub["_Date"];
    _Images: jEpub["_Images"];
    _Info: jEpub["_Info"];
    _Pages: jEpub["_Pages"];
    _Uuid: jEpub["_Uuid"];
    _Zip: jEpub["_Zip"];

    constructor() {
        this._Cover = null;
        this._Date = null;
        this._I18n = {} as jEpub["_I18n"];
        this._Images = [];
        this._Info = {} as jEpubInfo;
        this._Pages = [];
        this._Uuid = {} as jEpub["_Uuid"];
        this._Zip = new JSZip();
    }

    init(details) {
        if (details instanceof JSZip) {
            this._Zip = details;

            return this;
        }

        this._Info = {
            i18n: "en",
            title: "undefined",
            author: "undefined",
            publisher: "undefined",
            description: "",
            tags: [],
            ...details,
        };

        this._Uuid = {
            scheme: "uuid",
            id: utils.uuidv4(),
        };

        this._Date = utils.getISODate();

        if (!language[this._Info.i18n]) {
            throw new Error(`Unknown Language: ${this._Info.i18n}`);
        }

        this._I18n = language[this._Info.i18n];

        this._Zip = new JSZip();
        this._Zip.file("mimetype", mime);
        this._Zip.file("epub/container.xml", container);
        this._Zip.file(
            "OEBPS/title-page.html",
            info(
                this._I18n,
                this._Info.title,
                this._Info.author,
                this._Info.publisher,
                this._Info.tags,
                utils.parseDOM(this._Info.description)
            )
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
        }

        throw new Error("Date object is not valid");
    }

    uuid(id) {
        if (utils.isEmpty(id)) {
            throw new Error("UUID value is empty");
        } else {
            let scheme = "uuid";

            if (utils.validateUrl(id)) {
                scheme = "URI";
            }

            this._Uuid = {
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
        } else if (data instanceof ArrayBuffer) {
            ext = imageType(new Uint8Array(data));

            if (ext) {
                mimeCover = ext.mime;
                ext = utils.mime2ext(mimeCover);
            }
        } else {
            throw new Error("Cover data is not valid");
        }

        if (!ext) {
            throw new Error("Cover data is not allowed");
        }

        this._Cover = {
            type: mimeCover,
            path: `OEBPS/cover-image.${ext}`,
        };
        this._Zip.file(this._Cover.path, data);
        this._Zip.file(
            "OEBPS/front-cover.html",
            cover(this._I18n, this._Cover.path)
        );

        return this;
    }

    image(data, name, alt = "") {
        let ext;
        let mimeImage;

        if (data instanceof Blob) {
            mimeImage = data.type;
            ext = utils.mime2ext(mimeImage);
        } else if (data instanceof ArrayBuffer) {
            ext = imageType(new Uint8Array(data));
            mimeImage = ext.mime;

            if (ext) {
                ext = utils.mime2ext(mimeImage);
            }
        } else {
            throw new Error("Image data is not valid");
        }

        if (!ext) {
            throw new Error("Image data is not allowed");
        }

        const path = `assets/${name}.${ext}`;

        this._Images.push({
            type: mimeImage,
            name,
            path,
            alt,
        });

        this._Zip.file(`OEBPS/${path}`, data);

        return this;
    }

    notes(content) {
        if (utils.isEmpty(content)) {
            throw new Error("Notes is empty");
        } else {
            this._Zip.file(
                "OEBPS/notes.html",
                notes(this._I18n, utils.parseDOM(content))
            );

            return this;
        }
    }

    add(title, content, index = this._Pages.length) {
        let newContent = content;

        if (utils.isEmpty(title)) {
            throw new Error("Title is empty");
        } else if (utils.isEmpty(content)) {
            throw new Error(`Content of ${title} is empty`);
        } else {
            if (!Array.isArray(newContent)) {
                this._Images.forEach((image) => {
                    newContent = newContent.replace(
                        `{{ ${image.name} }}`,
                        `<img src="${image.path}" alt=""> </img>`
                    );
                });
                newContent = utils.parseDOM(newContent);
            }

            this._Zip.file(
                `OEBPS/page-${index}.html`,
                page(this._I18n, title, newContent)
            );
            this._Pages[index] = title;

            return this;
        }
    }

    generate(type = "blob", onUpdate): Blob {
        if (!JSZip.support[type]) {
            throw new Error(`This browser does not support ${type}`);
        }

        let hasNotes = this._Zip.file("OEBPS/notes.html");

        hasNotes = !!hasNotes;

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
            toc(this._I18n, this._Pages)
        );

        this._Zip.file(
            "toc.ncx",
            bookToc(
                this._I18n,
                this._Uuid,
                this._Info.title,
                this._Info.author,
                this._Pages,
                hasNotes
            )
        );

        return this._Zip.generateAsync(
            {
                type,
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9,
                },
                mimeType: "application/epub+zip",
            },
            onUpdate
        );
    }
}
