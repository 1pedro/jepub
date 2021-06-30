export function cover (i18n, coverPath ) {
    return`
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${i18n.code}">

<head>
\t<title>${i18n.cover}</title>
\t<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
</head>

<body>
\t<div id="cover-image">
\t\t<img src="../${coverPath}" alt="${i18n.cover}" />
\t</div>
</body>

</html>
`;
}
