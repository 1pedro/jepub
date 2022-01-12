import { Jepub } from "src/types";
export declare function bookConfig(i18n: Jepub["_i18n"], uuid: Jepub["_uuid"], date: string, title: string, author: string, publisher: string, description: string | undefined, tags: string[], cover: Jepub["_cover"], pages: Jepub["_pages"], notes: boolean, images: Jepub["_images"]): string;
export declare function bookToc(i18n: Jepub["_i18n"], uuid: Jepub["_uuid"], title: string, author: string, pages: Jepub["_pages"], hasNotes: boolean): string;
