/// <reference types="node" />
import * as Types from "./types";
export default class Jepub implements Types.Jepub {
    _i18n: Types.Jepub["_i18n"];
    _cover: Types.Jepub["_cover"] | null;
    _date: Types.Jepub["_date"];
    _images: Types.Jepub["_images"];
    _info: Types.Jepub["_info"];
    _pages: Types.Jepub["_pages"];
    _uuid: Types.Jepub["_uuid"];
    _zip: Types.Jepub["_zip"];
    constructor();
    init(details: any): this;
    static html2text(html: string, noBr?: boolean): string;
    date(date?: Date): this;
    uuid(id: string): this;
    cover(data: Blob | ArrayBuffer): this;
    image(data: Blob | ArrayBuffer, name: string, alt?: string): this;
    notes(content: string): this;
    add(title: string, content: string, index?: number): this;
    generate(type: Types.JepubOutputTypes | undefined, onUpdate: () => void): Promise<Blob | Buffer | ArrayBuffer | Uint8Array>;
}
