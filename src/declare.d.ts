export interface jEpub {
    _Cover: {
        path: string;
        type: string;
    };
    _Date: string;
    _I18n: {
        code?: string;
        cover?: string;
        info: string;
        note?: string;
        toc?: string;
    };
    _Images: jEpubImage[];

    _Info: jEpubInfo;
    _Pages: string[];
    _Uuid: {
        id: string;
        scheme: string;
    };
    _Zip: any;
}

export interface jEpubInfo {
    author: string;
    description: string;
    i18n?: string;
    publisher: string;
    tags?: string[];
    title: string;
}

export interface jEpubImage {
    alt?: string;
    name: string;
    path: string;
    type: string;
}
