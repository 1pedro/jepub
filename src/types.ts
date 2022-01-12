import * as Buffer from "buffer";
import JSZip from "jszip";

export interface Jepub {
    _cover: JepubCover | null;
    _date: string;
    _i18n: {
        code?: string;
        cover?: string;
        info: string;
        note?: string;
        toc?: string;
    };
    _images: JepubImage[];
    _info: JepubInfo;
    _pages: string[];
    _uuid: {
        id: string;
        scheme: string;
    };
    _zip: JSZip;
}

export type JepubCover = {
    path: string;
    type: string;
};

export interface JepubInfo {
    author: string;
    description: string;
    i18n: AvailableLanguages;
    publisher: string;
    tags: string[];
    title: string;
}

export interface JepubImage {
    alt?: string;
    name: string;
    path: string;
    type: string;
}

export type AvailableLanguages = "pt" | "en" | "vi" | "hi";

export type JepubOutputTypes =
    | "arraybuffer"
    | "blob"
    | "nodebuffer"
    | "uint8array";
