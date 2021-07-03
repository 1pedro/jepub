import { jEpub } from "src/declare";

export function page(
    i18n: jEpub["_I18n"],
    title: string,
    content: string | string[]
) {
    let contents = "";

    if (Array.isArray(content)) {
        content.forEach((item) => {
            contents += `<p class="indent">${item}</p>`;
        });
    } else {
        contents = content;
    }

    return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${i18n.code}">

<head>
\t<title>${title}</title>
\t<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
\t<div class="chapter type-1">
\t\t<div class="chapter-title-wrap">
\t\t\t<h2 class="chapter-title">${title}</h2>
\t\t</div>
\t\t<div class="ugc chapter-ugc">
            ${contents}
\t\t</div>
\t</div>
</body>

</html>
`;
}
