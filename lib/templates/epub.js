export function bookConfig(i18n, uuid, date, title, author, publisher, description = "", tags, cover, pages, notes, images) {
    let buildPages = "";
    let buildTocPages = "";
    let buildTags = "";
    let buildImages = "";
    const buildDescription = description
        ? `<dc:description>${description}</dc:description>`
        : "";
    const buildCover = cover
        ? `<meta name="cover" content="cover-image" />`
        : "";
    if (pages && pages.length) {
        pages.forEach((page, index) => {
            buildPages += `<item id="page-${index}" href="OEBPS/page-${index}.html" media-type="application/xhtml+xml" />`;
            buildTocPages += `<itemref idref="page-${index}" linear="yes" />`;
        });
    }
    if (tags && tags.length) {
        tags.forEach((tag) => {
            buildTags += `<dc:subject>${tag}</dc:subject>`;
        });
    }
    images.length &&
        images.forEach((image) => {
            buildImages += `<item id="${image.name}" href="OEBPS/${image.path}" media-type="${image.type}" />`;
        });
    return `
    <?xml version="1.0" encoding="UTF-8" ?>
<package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="PrimaryID">

\t<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
\t\t<dc:title>${title}</dc:title>
\t\t<dc:language>${i18n?.code || ""}</dc:language>
\t\t<dc:identifier id="PrimaryID" opf:scheme="${uuid.scheme}">${uuid.id}</dc:identifier>
        <dc:date opf:event="publication">${date}</dc:date>
        ${buildDescription}
\t\t<dc:creator opf:role="aut">${author}</dc:creator>
\t\t<dc:publisher>${publisher}</dc:publisher>
        ${buildCover}
        ${buildTags}
\t</metadata>

\t<manifest>
\t\t    ${cover
        ? '<item id="front-cover" href="OEBPS/front-cover.html" media-type="application/xhtml+xml" />'
        : ""}
\t\t<item id="title-page" href="OEBPS/title-page.html" media-type="application/xhtml+xml" />
\t\t<item id="notes" href="OEBPS/notes.html" media-type="application/xhtml+xml" />
\t\t<item id="table-of-contents" href="OEBPS/table-of-contents.html" media-type="application/xhtml+xml" />
        ${buildPages}

\t\t   ${cover
        ? `<item id="cover-image" href="${cover.path}" media-type="${cover.type}" properties="cover-image" />`
        : ""}

\t\t<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
        ${buildImages}
\t</manifest>

\t<spine toc="ncx">
\t\t    ${cover ? '<itemref idref="front-cover" linear="no" />' : ""}
\t\t<itemref idref="title-page" linear="yes" />
\t\t<itemref idref="table-of-contents" linear="yes" />
        ${buildTocPages}

        ${notes ? `<itemref idref="notes" linear="yes" />` : ""}
\t</spine>

\t<guide>
\t\t    ${cover
        ? `<reference type="cover" title="${i18n?.cover || ""}" href="OEBPS/front-cover.html" />`
        : ""}
\t\t<reference type="toc" title="${i18n?.toc || ""}" href="OEBPS/table-of-contents.html" />
\t</guide>

</package>
`;
}
export function bookToc(i18n, uuid, title, author, pages, hasNotes) {
    let buildPages = "";
    let buildNotes = "";
    if (pages && pages.length) {
        pages.forEach((pageTitle, index) => {
            buildPages += `
            <navPoint id="page-${index}" playOrder="${index + 3}">
                <navLabel>
                    <text>${pageTitle}</text>
                </navLabel>
                <content src="OEBPS/page-${index}.html" />
            </navPoint>`;
        });
    }
    if (hasNotes) {
        buildNotes = `
        <navPoint id="notes-page" playOrder="2">
                <navLabel>
                    <text>${i18n?.note || ""}</text>
                </navLabel>
                <content src="OEBPS/notes.html" />
            </navPoint>`;
    }
    return `
    <?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">

<ncx version="2005-1" xml:lang="${i18n?.code || ""}" xmlns="http://www.daisy.org/z3986/2005/ncx/">
\t<head>
\t\t<meta name="dtb:uid" content="${uuid.id}" />
\t\t<meta name="dtb:depth" content="2" />
\t\t<meta name="dtb:totalPageCount" content="0" />
\t\t<meta name="dtb:maxPageNumber" content="0" />
\t</head>

\t<docTitle>
\t\t<text>${title}</text>
\t</docTitle>

\t<docAuthor>
\t\t<text>${author}</text>
\t</docAuthor>

\t<navMap>
\t\t<navPoint id="title-page" playOrder="1">
\t\t\t<navLabel>
\t\t\t\t<text>${i18n?.info || ""}</text>
\t\t\t</navLabel>
\t\t\t<content src="OEBPS/title-page.html" />
\t\t</navPoint>
\t\t<navPoint id="table-of-contents" playOrder="2">
\t\t\t<navLabel>
\t\t\t\t<text>${i18n?.toc || ""}</text>
\t\t\t</navLabel>
\t\t\t<content src="OEBPS/table-of-contents.html" />
\t\t</navPoint>
        ${buildPages}
        ${buildNotes}
\t</navMap>
</ncx>
`;
}
