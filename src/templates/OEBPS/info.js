export function info(i18n, title, author, publisher,tags, description ="") {
    let buildTags = ""
    let buildDescription = ""
    if(Array.isArray(tags) && tags.length){
        buildTags += "<div class=\"part-title-wrap\">"
        tags.forEach(tag => {
            buildTags += `<code> ${tag} </code>`;
        })
        buildTags+= "</div>"
    }

    if(description) {
        buildDescription += `<div class=\"ugc\"> ${description} </div>`
    }

    return `
    <?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${i18n.code}">

<head>
\t<title>${i18n.info}</title>
\t<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
\t<div id="title-page">
\t\t<h1 class="title">${title}</h1>
\t\t<h2 class="subtitle"></h2>
\t\t<h3 class="author">${author}</h3>
\t\t<h4 class="publisher">${publisher}</h4>
\t</div>
    ${buildTags}

    ${buildDescription}
</body>

</html>
`
}
