export function toc(i18n, pages) {
    let buildPages = "";

    pages.forEach((title, index) => {
        buildPages += `
        <li class="chaptertype-1">
            <a href="page-${index}.html">
                <span class="toc-chapter-title">${title}</span>
            </a>
        </li>
        `
    })

    return `
    <?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${i18n.code}">

<head>
\t<title>${i18n.toc}</title>
\t<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
\t<div id="toc">
\t\t<h1>${i18n.toc}</h1>
\t\t<ul>
        ${buildPages}
\t\t</ul>
\t</div>
</body>

</html>
`
}
